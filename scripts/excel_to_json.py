import argparse
import json
import re
import sys
from pathlib import Path
from zipfile import BadZipFile

from openpyxl import load_workbook
from openpyxl.utils.exceptions import InvalidFileException


HEADER_ALIASES = {
    "rollNo": {"rollno", "rollnumber", "roll"},
    "name": {"name", "fullname", "candidate"},
    "department": {"department", "dept"},
    "role": {"role", "team", "position"},
    "selected": {"selected", "status"},
}
REQUIRED_FIELDS = {"rollNo", "name", "department", "role"}


def normalize_header(value):
    return "".join(character.lower() for character in str(value or "") if character.isalnum())


def text_value(value, field_name, row_number):
    if value is None:
        raise ValueError(f"Row {row_number}: missing {field_name}.")
    text = str(value).strip()
    if not text:
        raise ValueError(f"Row {row_number}: missing {field_name}.")
    return text


def roll_number_value(value, row_number):
    if isinstance(value, bool) or value is None:
        raise ValueError(f"Row {row_number}: missing or invalid roll number.")
    if isinstance(value, int):
        roll_no = str(value)
    elif isinstance(value, float) and value.is_integer():
        roll_no = str(int(value))
    else:
        roll_no = str(value).strip()

    if not re.fullmatch(r"25\d{1,18}", roll_no):
        raise ValueError(f"Row {row_number}: roll number {roll_no!r} must start with 25 and contain 3 to 20 digits.")
    return roll_no


def selected_value(value, row_number):
    normalized = normalize_header(value)
    if normalized in {"true", "yes", "y", "1", "selected"}:
        return True
    if normalized in {"false", "no", "n", "0", "notselected"}:
        return False
    raise ValueError(f"Row {row_number}: selected status must be yes/no, true/false, 1/0, or selected/not selected.")


def convert_workbook(input_path):
    workbook = load_workbook(input_path, read_only=True, data_only=True)
    try:
        worksheet = workbook.active
        rows = worksheet.iter_rows(values_only=True)
        headers = next(rows, None)
        if not headers:
            raise ValueError("The first worksheet is empty.")

        columns = {}
        for index, header in enumerate(headers):
            normalized = normalize_header(header)
            for field_name, aliases in HEADER_ALIASES.items():
                if normalized in aliases:
                    if field_name in columns:
                        raise ValueError(f"The first worksheet has more than one column for {field_name}.")
                    columns[field_name] = index
                    break

        missing_fields = REQUIRED_FIELDS - columns.keys()
        if missing_fields:
            raise ValueError("Missing required columns: " + ", ".join(sorted(missing_fields)))

        records = []
        seen_roll_numbers = set()
        for row_number, row in enumerate(rows, start=2):
            if not any(value is not None and str(value).strip() for value in row):
                continue

            def cell(field_name):
                index = columns.get(field_name)
                return row[index] if index is not None and index < len(row) else None

            roll_no = roll_number_value(cell("rollNo"), row_number)
            if roll_no in seen_roll_numbers:
                raise ValueError(f"Row {row_number}: duplicate roll number {roll_no}.")
            seen_roll_numbers.add(roll_no)

            record = {
                "rollNo": roll_no,
                "name": text_value(cell("name"), "name", row_number),
                "selected": selected_value(cell("selected"), row_number) if "selected" in columns else True,
                "role": text_value(cell("role"), "role", row_number),
                "department": text_value(cell("department"), "department", row_number),
            }
            records.append(record)

        if not records:
            raise ValueError("The first worksheet contains no result rows.")
        return records
    finally:
        workbook.close()


def main():
    parser = argparse.ArgumentParser(description="Convert an Excel results workbook to the app's JSON format.")
    parser.add_argument("excel_file", type=Path, help="Input .xlsx workbook; the first worksheet is used")
    parser.add_argument("json_file", type=Path, help="Output JSON file")
    arguments = parser.parse_args()

    try:
        records = convert_workbook(arguments.excel_file)
        arguments.json_file.parent.mkdir(parents=True, exist_ok=True)
        with arguments.json_file.open("w", encoding="utf-8") as output_file:
            json.dump(records, output_file, indent=2, ensure_ascii=False)
            output_file.write("\n")
    except (OSError, ValueError, InvalidFileException, BadZipFile) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    print(f"Converted {len(records)} result(s) to {arguments.json_file}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())