#!/usr/bin/env python3
"""Insert Practical Pandas chapter after NumPy and renumber later sections."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
STYLES = ROOT / "styles.css"

N_SHIFT_START = 96  # first section to shift upward
OFFSET: int  # set after LESSONS defined


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def pre(code: str) -> str:
    return f"<pre><code>{esc(code.strip())}</code></pre>"


def ul(items: list[str]) -> str:
    lis = "\n".join(f"              <li>{item}</li>" for item in items)
    return f"<ul>\n{lis}\n            </ul>"


def p(text: str) -> str:
    return f"<p>{text}</p>"


def h3(text: str) -> str:
    return f"<h3>{text}</h3>"


def ai(prompt: str) -> str:
    return (
        "<p><strong>Try this AI prompt:</strong></p>\n"
        f"            <p>{prompt}</p>"
    )


def lesson(num: int, icon: str, title: str, body: str) -> str:
    return f"""      <article class="lesson-card reveal" id="section-{num}" data-section="{num}" data-chapter="pandas">
        <span class="lesson-card__marker" aria-hidden="true">{num}</span>
        <div class="lesson-card__inner">
          <header class="lesson-card__header">
            <i data-lucide="{icon}" class="lesson-card__icon" aria-hidden="true"></i>
            <h2 class="lesson-card__title">{title}</h2>
          </header>
          <div class="lesson-card__body">
            {body}
          </div>
        </div>
      </article>
"""


# (icon, title, body_html_without_outer_indent_issues)
LESSON_DEFS: list[tuple[str, str, str]] = []


def add(icon: str, title: str, body: str) -> None:
    LESSON_DEFS.append((icon, title, body))


add(
    "table",
    "What Pandas Is",
    "\n".join(
        [
            p("<strong>Pandas</strong> is a Python library for working with structured data."),
            p("Structured data usually looks like a table with rows and columns."),
            p("You mainly use Pandas to:"),
            ul(
                [
                    "Read datasets.",
                    "View and understand datasets.",
                    "Select rows and columns.",
                    "Filter data.",
                    "Sort data.",
                    "Add, edit, or remove data.",
                    "Clean incorrect or missing values.",
                    "Group and summarize data.",
                    "Combine multiple datasets.",
                    "Perform basic exploratory data analysis.",
                    "Export processed data.",
                ]
            ),
            p("You do not need to memorize every Pandas function."),
            p("You need to understand:"),
            ul(
                [
                    "What your dataset contains.",
                    "What result you want.",
                    "Which rows or columns should be used.",
                    "What conditions should be applied.",
                    "How the result should be summarized or transformed.",
                ]
            ),
            p("Then you can explain the task clearly to an AI."),
            ai(
                "Explain what Pandas is used for in machine learning work, and list the main tasks it helps with."
            ),
        ]
    ),
)

SAMPLE_CODE = '''import pandas as pd
data = {
    "name": ["Asha", "Bikash", "Riya", "Suman", "Nisha", "Aman"],
    "department": ["HR", "IT", "Sales", "IT", "Sales", "HR"],
    "age": [25, 29, 24, 31, None, 27],
    "salary": [35000, 60000, 42000, 70000, 45000, None],
    "city": ["Kathmandu", "Lalitpur", "Kathmandu", "Bhaktapur", "Lalitpur", "Kathmandu"],
    "experience": [2, 5, 1, 7, 3, 2],
    "rating": [4.2, 4.8, 3.9, 4.7, 4.1, 4.0]
}
df = pd.DataFrame(data)'''

add(
    "database",
    "Sample Dataset",
    "\n".join(
        [
            p("Most examples in this chapter use one employee dataset."),
            p("The variable <code>df</code> is a Pandas DataFrame."),
            pre(SAMPLE_CODE),
            p("Notice that <code>age</code> and <code>salary</code> have some missing values on purpose. You will clean those later."),
            ai(
                "Explain the structure of this dataset. Identify what each row represents, what each column represents, and what questions I could answer using it."
            ),
        ]
    ),
)

add(
    "folder",
    "Dataset",
    "\n".join(
        [
            p("A <strong>dataset</strong> is a collection of related information."),
            p("A dataset can contain:"),
            ul(
                [
                    "Employee records.",
                    "Sales transactions.",
                    "Job applications.",
                    "Customer information.",
                    "Product information.",
                    "Website activity.",
                    "Survey responses.",
                ]
            ),
            p("A dataset keeps information organized so that it can be analyzed."),
            p("You use a dataset whenever you want to answer questions using data."),
            p("Example questions:"),
            ul(
                [
                    "Which department has the highest salary?",
                    "How many applicants have more than three years of experience?",
                    "Which products generated the most revenue?",
                    "Are there missing values in the data?",
                ]
            ),
            pre("print(df)"),
            ai(
                "Explain the structure of this dataset. Identify what each row represents, what each column represents, and what questions I could answer using it."
            ),
        ]
    ),
)

add(
    "layout-grid",
    "DataFrame",
    "\n".join(
        [
            p("A <strong>DataFrame</strong> is the main Pandas object."),
            p("It is a table containing rows and columns."),
            p("You can think of it as a programmable spreadsheet."),
            p("A DataFrame lets you manipulate and analyze an entire table."),
            p("Use a DataFrame when working with a complete dataset containing multiple columns."),
            pre("df = pd.DataFrame(data)"),
            ai(
                "Create a Pandas DataFrame from this employee data. Use columns for name, department, age, salary, city, and experience."
            ),
        ]
    ),
)

add(
    "list",
    "Series",
    "\n".join(
        [
            p("A <strong>Series</strong> is one column of a DataFrame."),
            p("For example, the salary column is a Series."),
            p("Many Pandas operations work on individual columns."),
            p("Use a Series when analyzing or changing one column."),
            pre('salary_column = df["salary"]\nprint(salary_column)'),
            ai("Select the salary column as a Pandas Series and calculate its average."),
        ]
    ),
)

add(
    "rows-3",
    "Rows and Columns",
    "\n".join(
        [
            p("A <strong>row</strong> represents one record."),
            p("A <strong>column</strong> represents one type of information."),
            p("In the employee dataset:"),
            ul(
                [
                    "One row represents one employee.",
                    "The salary column represents employee salary.",
                    "The department column represents employee department.",
                ]
            ),
            p("Most Pandas tasks involve choosing specific rows, specific columns, or both."),
            p("Use row and column selection when you do not need the entire dataset."),
            pre('selected = df[["name", "salary"]]\nprint(selected)'),
            ai("Select only the name, department, and salary columns from this DataFrame."),
        ]
    ),
)

add(
    "hash",
    "Index",
    "\n".join(
        [
            p("The <strong>index</strong> is the label Pandas uses to identify each row."),
            p("By default, Pandas creates indexes starting from zero."),
            p("The index is not usually part of the actual dataset unless you intentionally make a column the index."),
            p("Pandas uses the index to locate, align, and identify rows."),
            p("You mostly use it when:"),
            ul(
                [
                    "Selecting a particular row.",
                    "Resetting row numbers after filtering.",
                    "Using a meaningful unique value as a row identifier.",
                ]
            ),
            pre("df = df.reset_index(drop=True)"),
            p("This creates fresh row numbers."),
            ai(
                "Explain what the Pandas index is, and show how to reset it after filtering rows."
            ),
        ]
    ),
)

add(
    "binary",
    "Data Types",
    "\n".join(
        [
            p("Common Pandas data types include:"),
            ul(
                [
                    "<code>int</code> for whole numbers.",
                    "<code>float</code> for decimal numbers.",
                    "<code>object</code> or string for text.",
                    "<code>bool</code> for true or false.",
                    "<code>datetime</code> for dates and times.",
                ]
            ),
            p("Matching types matter. For example:"),
            ul(
                [
                    "Salary should be numeric.",
                    "Name should be text.",
                    "Joining date should be datetime.",
                    "Active status should be boolean.",
                ]
            ),
            p("If types are wrong:"),
            ul(
                [
                    "Calculations fail.",
                    "Dates are treated as text.",
                    "Numbers are stored as text.",
                    "Filtering produces unexpected results.",
                ]
            ),
            pre("print(df.dtypes)\ndf.info()"),
            ai(
                "Check the data types in this DataFrame. Tell me which columns may need conversion before analysis."
            ),
        ]
    ),
)

add(
    "download",
    "Importing and Reading Data",
    "\n".join(
        [
            h3("Importing Pandas"),
            p("Most projects start with:"),
            pre("import pandas as pd"),
            p("Common data sources include:"),
            ul(
                [
                    "CSV files.",
                    "Excel files.",
                    "JSON files.",
                    "Database queries.",
                    "APIs.",
                ]
            ),
            h3("Reading data"),
            pre('df = pd.read_csv("employees.csv")\ndf = pd.read_excel("employees.xlsx")'),
            p("After loading, always look at a small sample before changing anything."),
            ai(
                "Load this dataset and display the first ten rows and the last five rows."
            ),
        ]
    ),
)

add(
    "eye",
    "Viewing and Understanding Structure",
    "\n".join(
        [
            h3("Viewing the dataset"),
            p("Viewing means checking a small part of the dataset instead of printing everything."),
            pre("df.head()\ndf.tail()\ndf.sample(3)"),
            h3("Understanding structure"),
            p("Before analysis, learn:"),
            ul(
                [
                    "Number of rows.",
                    "Number of columns.",
                    "Column names.",
                    "Data types.",
                    "Missing values.",
                    "General numeric statistics.",
                ]
            ),
            pre(
                "print(df.shape)\nprint(df.columns)\ndf.info()\nprint(df.isna().sum())\ndf.describe()"
            ),
            ai(
                "Inspect this DataFrame. Report shape, column names, data types, missing value counts, and a short numeric summary."
            ),
        ]
    ),
)

add(
    "columns-3",
    "Selecting Columns",
    "\n".join(
        [
            p("Selecting fewer columns makes the result clearer."),
            p("Select one column:"),
            pre('df["salary"]'),
            p("Select multiple columns:"),
            pre('df[["name", "department", "salary"]]'),
            ai(
                "Select the name, city, experience, and salary columns. Store the result in a new DataFrame."
            ),
        ]
    ),
)

add(
    "mouse-pointer-2",
    "Selecting with loc and iloc",
    "\n".join(
        [
            h3("loc"),
            p("<code>loc</code> selects rows and columns by labels, and works well with conditions."),
            p("Common uses:"),
            ul(
                [
                    "Filtering rows.",
                    "Selecting specific columns at the same time.",
                    "Editing values under a condition.",
                ]
            ),
            pre(
                'result = df.loc[df["department"] == "IT", ["name", "salary"]]'
            ),
            h3("iloc"),
            p("<code>iloc</code> selects by position (numbers), not labels."),
            p("Common uses:"),
            ul(
                [
                    "Selecting the first row.",
                    "Selecting a range of rows.",
                    "Selecting columns by position.",
                ]
            ),
            pre("df.iloc[0:3, 0:2]"),
            p("That selects the first three rows and first two columns."),
            ai(
                "Using loc, select IT employees and show only name and salary. Using iloc, show the first three rows and first two columns."
            ),
        ]
    ),
)

add(
    "filter",
    "Filtering Rows",
    "\n".join(
        [
            p("Filtering means keeping only rows that match a condition."),
            p("Filtering helps answer specific questions."),
            p("Examples:"),
            ul(
                [
                    "Employees earning above 50000.",
                    "Applicants with more than three years of experience.",
                    "Products with low stock.",
                    "Transactions from Kathmandu.",
                ]
            ),
            pre('high_salary = df[df["salary"] > 50000]'),
            ai(
                "Filter employees with salary greater than 50000 and show name, department, and salary."
            ),
        ]
    ),
)

add(
    "git-merge",
    "Multiple Filters and isin",
    "\n".join(
        [
            h3("Multiple conditions"),
            p("Combine conditions with <code>&amp;</code> (and), <code>|</code> (or), and <code>~</code> (not)."),
            p("Put each condition in parentheses."),
            p("Examples:"),
            ul(
                [
                    "IT employees earning above 50000.",
                    "Candidates from Kathmandu or Lalitpur.",
                    "Employees who are not in HR.",
                    "Applicants with experience between two and five years.",
                ]
            ),
            pre(
                'result = df[\n    (df["department"] == "IT") &\n    (df["experience"] >= 3) &\n    (df["salary"] > 50000)\n]'
            ),
            h3("Filtering from a list"),
            p("Use <code>isin</code> when values must match one of several options."),
            pre('result = df[df["city"].isin(["Kathmandu", "Lalitpur"])]'),
            ai(
                "Filter employees who work in IT, have at least three years of experience, and earn more than 50000. Also show a version that keeps only Kathmandu or Lalitpur using isin."
            ),
        ]
    ),
)

add(
    "text-search",
    "Filtering Text",
    "\n".join(
        [
            p("Pandas can search inside text columns."),
            p("Text data often needs partial matching."),
            p("Examples:"),
            ul(
                [
                    "Names containing a word.",
                    "Job titles containing manager.",
                    "Email addresses from a certain domain.",
                    "Product descriptions containing laptop.",
                ]
            ),
            pre('result = df[df["name"].str.contains("a", case=False, na=False)]'),
            ai(
                "Filter rows where the name contains the letter a. Ignore uppercase and lowercase differences and handle missing values safely."
            ),
        ]
    ),
)

add(
    "arrow-up-down",
    "Sorting and Top Bottom Records",
    "\n".join(
        [
            h3("Sorting data"),
            p("Sorting arranges rows according to one or more columns."),
            p("Examples: highest salary first, most experience first, newest applications first."),
            pre(
                'sorted_df = df.sort_values("salary", ascending=False)\n\nsorted_df = df.sort_values(\n    ["department", "salary"],\n    ascending=[True, False]\n)'
            ),
            h3("Top or bottom records"),
            p("Use <code>nlargest</code> and <code>nsmallest</code> when you only need a few extreme values."),
            pre('top_three = df.nlargest(3, "salary")'),
            ai(
                "Sort employees by department alphabetically and then by salary from highest to lowest. Also find the five employees with the highest salaries and show name, department, and salary."
            ),
        ]
    ),
)

add(
    "plus-square",
    "Adding Columns",
    "\n".join(
        [
            p("A new column can be created from a fixed value, existing columns, a condition, a calculation, or a transformation."),
            p("Examples: annual salary from monthly salary, eligible status from experience, total price from quantity and unit price."),
            pre('df["annual_salary"] = df["salary"] * 12'),
            p("Conditional columns classify records:"),
            pre(
                'import numpy as np\n\ndf["level"] = np.where(\n    df["experience"] >= 5,\n    "Senior",\n    "Junior"\n)'
            ),
            ai(
                "Add an annual_salary column by multiplying monthly salary by 12. Also create a level column that marks employees with five or more years of experience as Senior and everyone else as Junior."
            ),
        ]
    ),
)

add(
    "pencil",
    "Editing Replacing and Renaming",
    "\n".join(
        [
            h3("Editing values"),
            p("Editing means changing existing values when data is incorrect, inconsistent, or outdated."),
            pre('df.loc[df["name"] == "Asha", "salary"] = 40000'),
            h3("Replacing values"),
            p("Replace inconsistent labels during cleaning."),
            pre(
                'df["city"] = df["city"].replace({\n    "KTM": "Kathmandu",\n    "LTP": "Lalitpur"\n})'
            ),
            h3("Renaming columns"),
            p("Rename when names have spaces, unclear abbreviations, or inconsistent capitalization."),
            pre(
                'df = df.rename(columns={\n    "name": "employee_name",\n    "salary": "monthly_salary"\n})'
            ),
            ai(
                "Update Asha's salary to 40000 using loc. Standardize city names by replacing KTM with Kathmandu and LTP with Lalitpur. Rename name to employee_name and salary to monthly_salary."
            ),
        ]
    ),
)

add(
    "trash-2",
    "Deleting Columns and Rows",
    "\n".join(
        [
            h3("Deleting columns"),
            p("Remove fields you no longer need so analysis stays clear and private data stays out of reports."),
            pre('df = df.drop(columns=["rating"])'),
            h3("Deleting rows"),
            p("Remove invalid, irrelevant, or incorrect records by index or by condition."),
            pre('df = df[df["salary"] >= 20000]'),
            p("This keeps only valid salary records."),
            ai(
                "Remove the rating and age columns without modifying the original DataFrame. Remove rows where salary is below 20000 and reset the index afterward."
            ),
        ]
    ),
)

add(
    "calculator",
    "Calculations apply and map",
    "\n".join(
        [
            h3("Column calculations"),
            p("Pandas can calculate on whole columns without a manual loop."),
            pre('df["bonus"] = df["salary"] * 0.10'),
            h3("Applying a function"),
            p("<code>apply</code> runs a custom function on column values."),
            pre(
                'def classify_experience(years):\n    if years >= 5:\n        return "Senior"\n    if years >= 2:\n        return "Mid"\n    return "Entry"\n\ndf["experience_level"] = df["experience"].apply(classify_experience)'
            ),
            h3("Mapping values"),
            p("<code>map</code> converts values with a dictionary."),
            pre(
                'department_codes = {\n    "HR": "Human Resources",\n    "IT": "Information Technology",\n    "Sales": "Sales Department"\n}\ndf["department_full"] = df["department"].map(department_codes)'
            ),
            ai(
                "Create a bonus column equal to ten percent of salary. Use apply to create experience_level as Entry, Mid, or Senior. Map department codes to full department names in a new column."
            ),
        ]
    ),
)

add(
    "circle-off",
    "Missing Values",
    "\n".join(
        [
            p("A missing value means data is unavailable. Pandas often shows these as <code>NaN</code> or <code>None</code>."),
            p("Missing values can break calculations, skew averages, hurt models, remove rows from analysis, or reveal collection problems."),
            pre("df.isna().sum()"),
            h3("Removing missing values"),
            p("Remove rows when the missing field is essential, only a few rows are affected, or filling would mislead."),
            pre('clean_df = df.dropna(subset=["salary"])'),
            h3("Filling missing values"),
            p("Common choices: median for many numeric columns, mode for categories, Unknown for text."),
            pre(
                'df["salary"] = df["salary"].fillna(df["salary"].median())\ndf["city"] = df["city"].fillna("Unknown")'
            ),
            h3("Mean, median, or mode"),
            ul(
                [
                    "Mean is the average. Use it when numeric data is balanced.",
                    "Median is the middle value after sorting. Use it when there are unusually high or low values.",
                    "Mode is the most common value. Use it for categories or repeated values.",
                ]
            ),
            pre(
                'salary_mean = df["salary"].mean()\nsalary_median = df["salary"].median()\ncity_mode = df["city"].mode()[0]'
            ),
            ai(
                "Count missing values in each column. Fill missing salary with the median and missing city with Unknown. Compare mean and median salary and explain which is better for filling salary."
            ),
        ]
    ),
)

add(
    "copy",
    "Duplicates",
    "\n".join(
        [
            p("Duplicate rows contain repeated records."),
            p("Duplicates can incorrectly increase totals, averages, and counts."),
            p("Check them when combining files, importing records, collecting forms, working with transactions, or cleaning applicants."),
            pre(
                'duplicates = df[df.duplicated()]\nduplicate_count = df.duplicated().sum()'
            ),
            p("Removing duplicates keeps one version of repeated records."),
            pre(
                'df = df.drop_duplicates()\n\ndf = df.drop_duplicates(\n    subset=["name", "department"],\n    keep="first"\n)'
            ),
            ai(
                "Find all completely duplicated rows and report the count. Remove duplicate employees based on name and department, keep the first record, and reset the index."
            ),
        ]
    ),
)

add(
    "spell-check",
    "Cleaning Text",
    "\n".join(
        [
            h3("Standardizing text"),
            p("Text standardization makes values consistent. Kathmandu, kathmandu, and KATHMANDU should usually become one value."),
            p("Pandas treats differently written values as different categories."),
            pre(
                'df["city"] = (\n    df["city"]\n    .str.strip()\n    .str.title()\n)'
            ),
            h3("Changing case"),
            p("Use lowercase for emails, uppercase for product codes, and title case for names when that matches your rules."),
            pre('df["name"] = df["name"].str.title()'),
            h3("Splitting text columns"),
            p("Split one text field into several columns when combined values are hard to analyze."),
            pre(
                'email_data = pd.DataFrame({\n    "email": ["asha@example.com", "bikash@company.com"]\n})\nemail_data[["username", "domain"]] = email_data["email"].str.split(\n    "@",\n    expand=True\n)'
            ),
            ai(
                "Clean the city column by removing extra spaces and converting every city to title case. Convert names to title case and departments to uppercase. Split an email column into username and domain while keeping the original email."
            ),
        ]
    ),
)

add(
    "calendar",
    "Dates and Times",
    "\n".join(
        [
            h3("Converting text to dates"),
            p("Dates often load as text. Convert them to datetime for correct sorting, filtering, grouping, and calculation."),
            pre(
                'df["joining_date"] = pd.to_datetime(\n    df["joining_date"],\n    errors="coerce"\n)'
            ),
            p("Invalid dates become missing values."),
            h3("Extracting date parts"),
            pre(
                'df["joining_year"] = df["joining_date"].dt.year\ndf["joining_month"] = df["joining_date"].dt.month'
            ),
            h3("Filtering by date"),
            pre(
                'result = df[\n    df["joining_date"] >= "2026-01-01"\n]'
            ),
            ai(
                "Convert joining_date to datetime with invalid dates becoming missing. Extract year and month. Filter records between July 1, 2026 and July 31, 2026 inclusive."
            ),
        ]
    ),
)

add(
    "sigma",
    "Aggregation and Groupby",
    "\n".join(
        [
            h3("Aggregation"),
            p("Aggregation reduces many values into a summary such as count, sum, mean, median, minimum, or maximum."),
            pre(
                'average_salary = df["salary"].mean()\nhighest_salary = df["salary"].max()\nemployee_count = df["name"].count()'
            ),
            h3("Grouping data"),
            p("<code>groupby</code> divides data into categories and calculates a summary for each category."),
            pre(
                'result = (\n    df.groupby("department")["salary"]\n    .mean()\n    .reset_index()\n)'
            ),
            h3("Multiple aggregations"),
            pre(
                'summary = (\n    df.groupby("department")\n    .agg(\n        employee_count=("name", "count"),\n        average_salary=("salary", "mean"),\n        maximum_salary=("salary", "max"),\n        average_experience=("experience", "mean")\n    )\n    .reset_index()\n)'
            ),
            ai(
                "Group employees by department and calculate employee count, average salary, maximum salary, and average experience with clear column names."
            ),
        ]
    ),
)

add(
    "pie-chart",
    "Value Counts and Percentages",
    "\n".join(
        [
            p("<code>value_counts</code> counts how often each value appears."),
            pre(
                'department_counts = df["department"].value_counts()\n\ndepartment_counts = (\n    df["department"]\n    .value_counts()\n    .reset_index()\n)'
            ),
            p("Percentages are easier to compare than raw counts in many reports."),
            pre(
                'percentages = (\n    df["department"]\n    .value_counts(normalize=True)\n    .mul(100)\n)'
            ),
            ai(
                "Count employees in each department from largest to smallest. Also calculate the percentage of employees in each department rounded to two decimals."
            ),
        ]
    ),
)

add(
    "combine",
    "Concat and Merge",
    "\n".join(
        [
            h3("Concatenating DataFrames"),
            p("Concatenation places DataFrames above or beside each other. Most often you stack rows from similar files."),
            pre(
                'combined = pd.concat(\n    [january_df, february_df],\n    ignore_index=True\n)'
            ),
            h3("Merging DataFrames"),
            p("Merging combines datasets using a shared column. It is like looking up related information from another table."),
            pre(
                'merged = pd.merge(\n    employees_df,\n    salaries_df,\n    on="employee_id",\n    how="left"\n)'
            ),
            h3("Merge types"),
            ul(
                [
                    "Inner merge keeps only matching records.",
                    "Left merge keeps every record from the first DataFrame.",
                    "Right merge keeps every record from the second DataFrame.",
                    "Outer merge keeps every record from both DataFrames.",
                ]
            ),
            p("Use inner when only complete matches matter. Use left when your first table is the main dataset. Use outer when you want to detect missing matches from either side."),
            ai(
                "Combine January and February files by stacking rows. Merge employees with salaries on employee_id using a left merge so every employee remains even when salary is missing."
            ),
        ]
    ),
)

add(
    "table-2",
    "Pivot and Melt",
    "\n".join(
        [
            h3("Pivot tables"),
            p("A pivot table summarizes values using rows and columns for compact business reports."),
            pre(
                'pivot = pd.pivot_table(\n    df,\n    values="salary",\n    index="department",\n    columns="city",\n    aggfunc="mean"\n)'
            ),
            h3("Wide data to long data"),
            p("Wide data stores similar measurements in separate columns. Long data stores the measurement type in one column and values in another."),
            p("Long format is often easier for grouping, charting, and machine learning preparation."),
            pre(
                'long_df = df.melt(\n    id_vars=["name"],\n    value_vars=["January", "February"],\n    var_name="month",\n    value_name="sales"\n)'
            ),
            ai(
                "Create a pivot table of average salary by department and city, filling missing combinations with zero. Convert a monthly sales table from wide format to long format with month and sales columns."
            ),
        ]
    ),
)

add(
    "search",
    "Basic EDA",
    "\n".join(
        [
            p("<strong>EDA</strong> means exploratory data analysis. It is how you understand a dataset before conclusions or models."),
            p("EDA helps detect missing values, duplicate rows, incorrect data types, unusual values, category distributions, numeric relationships, and quality problems."),
            p("Use EDA before reporting, machine learning, dashboards, business decisions, and deep cleaning."),
            pre(
                "print(df.shape)\nprint(df.dtypes)\nprint(df.isna().sum())\nprint(df.duplicated().sum())\nprint(df.describe())"
            ),
            h3("Descriptive statistics"),
            p("Describe shows count, mean, standard deviation, minimum, maximum, quartiles, and median for numeric columns."),
            pre('df[["age", "salary", "experience", "rating"]].describe()'),
            h3("Unique values"),
            pre(
                'print(df["department"].unique())\nprint(df["department"].nunique())'
            ),
            h3("Unusual values"),
            p("Examples: negative salary, age of 250, rating above 5, experience greater than age."),
            pre(
                'invalid_ratings = df[\n    (df["rating"] < 0) |\n    (df["rating"] > 5)\n]'
            ),
            h3("Correlation"),
            p("Correlation measures whether two numeric columns tend to change together. A value near zero means little linear relationship."),
            p("Correlation does not prove that one variable causes another."),
            pre(
                'correlation = df[\n    ["age", "salary", "experience", "rating"]\n].corr()\nprint(correlation)'
            ),
            ai(
                "Perform basic EDA on this dataset. Show dimensions, types, missing values, duplicates, numeric summaries, unique text values, suspicious values, and correlations. Explain findings in simple language without claiming causation."
            ),
        ]
    ),
)

add(
    "file-output",
    "Exporting Results",
    "\n".join(
        [
            h3("Exporting to CSV"),
            pre(
                'df.to_csv(\n    "cleaned_data.csv",\n    index=False\n)'
            ),
            p("<code>index=False</code> prevents Pandas row numbers from becoming a file column."),
            h3("Exporting to Excel"),
            pre(
                'df.to_excel(\n    "cleaned_data.xlsx",\n    index=False\n)'
            ),
            h3("Multiple sheets"),
            pre(
                'with pd.ExcelWriter("employee_report.xlsx") as writer:\n    df.to_excel(writer, sheet_name="Employees", index=False)\n    summary.to_excel(writer, sheet_name="Summary", index=False)'
            ),
            ai(
                "Export the cleaned DataFrame to CSV without the index. Also export employee records and a department summary into separate sheets of one Excel file."
            ),
        ]
    ),
)

add(
    "alert-triangle",
    "Common Mistakes",
    "\n".join(
        [
            h3("Incorrect column name"),
            p("Column names are case sensitive. <code>df[\"Salary\"]</code> fails if the real name is <code>salary</code>."),
            pre("print(df.columns.tolist())"),
            h3("Numbers stored as text"),
            p("Values like <code>\"50000\"</code>, <code>\"NPR 50,000\"</code>, or <code>\"60k\"</code> can break math."),
            pre(
                'df["salary"] = (\n    df["salary"]\n    .astype(str)\n    .str.replace(",", "", regex=False)\n    .str.replace("NPR", "", regex=False)\n    .str.strip()\n)\ndf["salary"] = pd.to_numeric(df["salary"], errors="coerce")'
            ),
            h3("Dates stored as text"),
            p("Text dates may sort alphabetically instead of by time."),
            pre('df["date"] = pd.to_datetime(df["date"], errors="coerce")'),
            h3("Missing parentheses in filters"),
            p("Wrong:"),
            pre('df[df["department"] == "IT" & df["salary"] > 50000]'),
            p("Correct:"),
            pre(
                'df[\n    (df["department"] == "IT") &\n    (df["salary"] > 50000)\n]'
            ),
            h3("Using and instead of &amp;"),
            p("In Pandas filters use <code>&amp;</code> and <code>|</code>, not Python <code>and</code> / <code>or</code>."),
            h3("Changing the original by accident"),
            p("Prefer a new variable when cleaning."),
            pre('clean_df = df.dropna(subset=["salary"])'),
            h3("Merge creating extra rows"),
            p("A merge can multiply rows when the merge key is duplicated."),
            pre(
                'print(employees_df["employee_id"].duplicated().sum())\nprint(salaries_df["employee_id"].duplicated().sum())'
            ),
            ai(
                "Review this Pandas code for KeyError risk, text numbers, text dates, filter parentheses, and merge duplicates. Fix only the important mistakes and explain each fix briefly."
            ),
        ]
    ),
)

add(
    "list-ordered",
    "Practical Workflow",
    "\n".join(
        [
            p("For most datasets, follow this order."),
            pre(
                '''# 1 Load
df = pd.read_csv("data.csv")

# 2 Preview
df.head()

# 3 Inspect
print(df.shape)
df.info()

# 4 Check quality
print(df.isna().sum())
print(df.duplicated().sum())

# 5 Fix column names
df.columns = (
    df.columns
    .str.strip()
    .str.lower()
    .str.replace(" ", "_")
)

# 6 Fix data types
df["salary"] = pd.to_numeric(df["salary"], errors="coerce")

# 7 Clean missing values and duplicates
df = df.drop_duplicates()
df["salary"] = df["salary"].fillna(df["salary"].median())

# 8 Filter and transform
result = df[df["experience"] >= 3].copy()
result["annual_salary"] = result["salary"] * 12

# 9 Group or summarize
summary = (
    result.groupby("department")
    .agg(
        employee_count=("name", "count"),
        average_salary=("salary", "mean")
    )
    .reset_index()
)

# 10 Export
summary.to_csv("department_summary.csv", index=False)'''
            ),
            ai(
                "Write a complete Pandas workflow for this CSV that loads, previews, inspects quality, cleans names and types, handles missing values and duplicates, filters, summarizes by department, and exports without changing unnecessary original intent."
            ),
        ]
    ),
)

add(
    "message-square",
    "Instructing AI for Pandas",
    "\n".join(
        [
            p("A weak prompt:"),
            p("<em>Analyze my data.</em>"),
            p("A better prompt names the file, cleaning rules, filters, grouping, sort order, and export target."),
            pre(
                '''Load employees.csv using Pandas.
Inspect the dataset structure and clean the column names.
Convert salary and experience to numeric values.
Remove completely duplicated rows.
Fill missing salary values with the median salary.
Filter employees with at least three years of experience.
Group the remaining data by department and calculate employee count and average salary.
Sort by average salary from highest to lowest.
Export the final result to department_summary.csv without the index.
Explain each major step briefly.'''
            ),
            p("A strong Pandas prompt should mention:"),
            ul(
                [
                    "Input source.",
                    "Relevant column names.",
                    "Required filters.",
                    "Missing value rules.",
                    "Duplicate rules.",
                    "Required calculations.",
                    "Required grouping.",
                    "Sort order.",
                    "Expected output columns.",
                    "Export format.",
                    "Whether the original data should remain unchanged.",
                ]
            ),
        ]
    ),
)

CHEAT = '''# Import
import pandas as pd

# Create / read
df = pd.DataFrame(data)
df = pd.read_csv("data.csv")
df = pd.read_excel("data.xlsx")

# Preview
df.head()
df.tail()
df.shape
df.columns
df.info()
df.dtypes
df.describe()

# Select / filter / sort
df["salary"]
df[["name", "salary"]]
df[df["salary"] > 50000]
df[(df["department"] == "IT") & (df["salary"] > 50000)]
df[df["city"].isin(["Kathmandu", "Lalitpur"])]
df.sort_values("salary", ascending=False)

# Change data
df["annual_salary"] = df["salary"] * 12
df.loc[df["name"] == "Asha", "salary"] = 40000
df = df.rename(columns={"name": "employee_name"})
df = df.drop(columns=["rating"])

# Missing / duplicates
df.isna().sum()
df = df.dropna(subset=["salary"])
df["salary"] = df["salary"].fillna(df["salary"].median())
df[df.duplicated()]
df = df.drop_duplicates()

# Summarize / combine / export
df["department"].value_counts()
df.groupby("department")["salary"].mean()
df.groupby("department").agg(
    employee_count=("name", "count"),
    average_salary=("salary", "mean")
)
df["salary"] = pd.to_numeric(df["salary"], errors="coerce")
df["date"] = pd.to_datetime(df["date"], errors="coerce")
pd.merge(first_df, second_df, on="id", how="left")
pd.concat([first_df, second_df], ignore_index=True)
df.to_csv("result.csv", index=False)
df.to_excel("result.xlsx", index=False)'''

add(
    "bookmark",
    "Pandas Cheat Sheet",
    "\n".join(
        [
            p("Keep this compact sheet nearby while you practice."),
            pre(CHEAT),
        ]
    ),
)

add(
    "bot",
    "Practical AI Prompts",
    "\n".join(
        [
            p("Reuse these prompts when you work with an AI coding assistant."),
            h3("Filter rows"),
            p("Write Pandas code to filter rows where salary is greater than 50000 and experience is at least three years. Return only name, department, salary, and experience. Do not modify the original DataFrame."),
            h3("Basic EDA"),
            p("Perform basic EDA. Show rows and columns, column names, data types, missing counts and percentages, duplicate count, numeric summaries, unique text counts, and possible invalid values. Explain findings in simple language."),
            h3("Remove duplicates"),
            p("Report the number of duplicates, then remove duplicates based on name, email, and phone. Keep the most recent record based on updated_at."),
            h3("Fill missing values"),
            p("Use median for salary and age, mode for department, Unknown for city. Do not fill missing emails. Explain each choice."),
            h3("Group and average"),
            p("Group by category and calculate count, average price, median price, minimum price, and maximum price with clear column names."),
            h3("Select and sort"),
            p("Select name, department, salary, experience, and rating. Sort by rating then experience, both highest first."),
            h3("Clean column names"),
            p("Strip spaces, lowercase names, replace spaces with underscores, and remove unnecessary special characters."),
            h3("Clean numeric values"),
            p("Clean salary values that may contain NPR, commas, spaces, or invalid text. Convert valid values to numeric and invalid values to missing. Show rows that could not convert."),
            h3("Clean text categories"),
            p("Clean city by trimming and making capitalization consistent. Combine KTM, ktm, and Kathmandu into Kathmandu."),
            h3("Merge two tables"),
            p("Merge applications with candidates on candidate_id. Keep every application even if candidate information is missing. Show applications with no match."),
            h3("Date analysis"),
            p("Convert application_date to datetime, remove invalid dates, filter July 2026, and group by day for daily application counts."),
            h3("Validation rules"),
            p("Validate age 16 to 80, positive salary, non negative experience, rating zero to five, and email containing @. Create a DataFrame of invalid rows with a failure reason column."),
            h3("Complete cleaning workflow"),
            p("Load, preview, standardize names, remove empty rows and columns, fix types, report missing values, remove duplicates, standardize text, detect suspicious numbers, keep the original unchanged, and export cleaned data plus rejected rows to separate Excel sheets."),
            h3("Business summary"),
            p("Calculate total employees, employees per department, average and median salary, averages by department, highest paid employee, employees with missing information, and city percentages. Return clean tables and a brief explanation."),
            h3("Debug generated code"),
            p("Check column names, filter parentheses, numeric types, missing value handling, merge duplicates, accidental edits to the original, and final output columns. Correct the code and explain only important changes."),
        ]
    ),
)

add(
    "check-circle-2",
    "Closing Checklist",
    "\n".join(
        [
            p("You are ready to use Pandas effectively when you understand these ideas:"),
            ul(
                [
                    "A DataFrame is a complete table.",
                    "A Series is one column.",
                    "Rows are records.",
                    "Columns are variables or fields.",
                    "The index identifies rows.",
                    "Data types control what operations are possible.",
                    "Filtering keeps rows that match conditions.",
                    "Selection keeps the columns you need.",
                    "Transformation creates or changes values.",
                    "Aggregation summarizes many rows.",
                    "Grouping calculates summaries for categories.",
                    "Merging connects related tables.",
                    "Missing values and duplicates must be checked.",
                    "EDA helps you understand data quality and patterns.",
                    "Exporting saves your final result.",
                ]
            ),
            p("You do not need to remember every function."),
            p("You need to be able to say:"),
            ul(
                [
                    "Load this dataset.",
                    "Check its structure and data quality.",
                    "Convert these columns to the correct types.",
                    "Clean missing and duplicate records using these rules.",
                    "Filter rows using these conditions.",
                    "Create these calculated columns.",
                    "Group the data using this category.",
                    "Calculate these summary values.",
                    "Sort the result this way.",
                    "Export these columns to this file format.",
                ]
            ),
            p("That is the practical Pandas knowledge required to work effectively with an AI coding assistant."),
            """<aside class="summary-callout">
              <h3>Pandas takeaways</h3>
              <ul>
                <li>Pandas is the table tool for structured data after NumPy.</li>
                <li>Always inspect shape, types, missing values, and duplicates before modeling.</li>
                <li>Clear filter, clean, group, and export language helps both you and AI.</li>
              </ul>
              <p>Read this chapter after NumPy and before the Day 13 end to end project.</p>
            </aside>""",
        ]
    ),
)

OFFSET = len(LESSON_DEFS)
assert OFFSET == 36, OFFSET


def build_toc() -> str:
    links = []
    for i, (_icon, title, _body) in enumerate(LESSON_DEFS):
        n = 96 + i
        links.append(
            f'          <li><a class="toc-link" href="#section-{n}" data-section="{n}">{title}</a></li>'
        )
    return f"""      <div class="toc-chapter" data-chapter="pandas">
        <button type="button" class="toc-chapter__toggle" aria-expanded="false" aria-controls="toc-panel-pandas">
          <span class="toc-chapter__pill">Pandas</span>
          <span class="toc-chapter__name">Learning Pandas</span>
          <i data-lucide="chevron-down" class="toc-chapter__chevron" aria-hidden="true"></i>
        </button>
        <ul class="toc-chapter__links" id="toc-panel-pandas" hidden>
{chr(10).join(links)}
        </ul>
      </div>
"""


def build_chapter_html() -> str:
    parts = [
        '      <!-- PANDAS (bonus chapter after NumPy; read before Day 13) -->',
        '      <div class="chapter-divider reveal" id="chapter-pandas" data-chapter="pandas">',
        '        <span class="chapter-divider__pill">Pandas</span>',
        '        <h2 class="chapter-divider__title">Learning Pandas</h2>',
        '        <p class="chapter-divider__note">Read this after NumPy and before Day 13. Pandas is the table tool for the end to end project. This bonus chapter does not count as a course day.</p>',
        "      </div>",
        "",
    ]
    for i, (icon, title, body) in enumerate(LESSON_DEFS):
        parts.append(lesson(96 + i, icon, title, body))
    return "\n".join(parts)


def shift_section_numbers(html: str, start: int, offset: int) -> str:
    """Shift section numbers >= start by offset, high to low to avoid collisions."""
    max_n = max(int(n) for n in re.findall(r'id="section-(\d+)"', html))
    for n in range(max_n, start - 1, -1):
        new = n + offset
        html = html.replace(f'id="section-{n}"', f'id="section-{new}"')
        html = html.replace(f'href="#section-{n}"', f'href="#section-{new}"')
        html = html.replace(f'data-section="{n}"', f'data-section="{new}"')
        # lesson markers: only exact marker spans
        marker_pat = (
            r'(<span class="lesson-card__marker" aria-hidden="true">)'
            + str(n)
            + r"(</span>)"
        )
        html = re.sub(marker_pat, rf"\g<1>{new}\g<2>", html)
    return html


def patch_styles(css: str) -> str:
    if "--chapter-pandas:" in css:
        return css
    css = css.replace(
        "  --chapter-numpy: #ea580c;\n",
        "  --chapter-numpy: #ea580c;\n  --chapter-pandas: #16a34a;\n",
    )
    replacements = [
        (
            '.toc-chapter[data-chapter="numpy"] .toc-chapter__toggle {\n  border-left: 3px solid var(--chapter-numpy);\n}',
            '.toc-chapter[data-chapter="numpy"] .toc-chapter__toggle {\n  border-left: 3px solid var(--chapter-numpy);\n}\n\n.toc-chapter[data-chapter="pandas"] .toc-chapter__toggle {\n  border-left: 3px solid var(--chapter-pandas);\n}',
        ),
        (
            '.toc-chapter[data-chapter="numpy"] .toc-chapter__pill {\n  background: var(--chapter-numpy);\n}',
            '.toc-chapter[data-chapter="numpy"] .toc-chapter__pill {\n  background: var(--chapter-numpy);\n}\n\n.toc-chapter[data-chapter="pandas"] .toc-chapter__pill {\n  background: var(--chapter-pandas);\n}',
        ),
        (
            '.toc-chapter[data-chapter="numpy"] .toc-link.is-active {\n  border-color: var(--chapter-numpy);\n}',
            '.toc-chapter[data-chapter="numpy"] .toc-link.is-active {\n  border-color: var(--chapter-numpy);\n}\n\n.toc-chapter[data-chapter="pandas"] .toc-link.is-active {\n  border-color: var(--chapter-pandas);\n}',
        ),
        (
            '.chapter-divider[data-chapter="numpy"] {\n  border-left: 5px solid var(--chapter-numpy);\n}',
            '.chapter-divider[data-chapter="numpy"] {\n  border-left: 5px solid var(--chapter-numpy);\n}\n\n.chapter-divider[data-chapter="pandas"] {\n  border-left: 5px solid var(--chapter-pandas);\n}',
        ),
        (
            '.chapter-divider[data-chapter="numpy"] .chapter-divider__pill {\n  background: var(--chapter-numpy);\n}',
            '.chapter-divider[data-chapter="numpy"] .chapter-divider__pill {\n  background: var(--chapter-numpy);\n}\n\n.chapter-divider[data-chapter="pandas"] .chapter-divider__pill {\n  background: var(--chapter-pandas);\n}',
        ),
        (
            '.lesson-card[data-chapter="numpy"] {\n  border-left: 5px solid var(--chapter-numpy);\n}',
            '.lesson-card[data-chapter="numpy"] {\n  border-left: 5px solid var(--chapter-numpy);\n}\n\n.lesson-card[data-chapter="pandas"] {\n  border-left: 5px solid var(--chapter-pandas);\n}',
        ),
        (
            '.lesson-card[data-chapter="numpy"] .lesson-card__marker {\n  background: var(--chapter-numpy);\n}',
            '.lesson-card[data-chapter="numpy"] .lesson-card__marker {\n  background: var(--chapter-numpy);\n}\n\n.lesson-card[data-chapter="pandas"] .lesson-card__marker {\n  background: var(--chapter-pandas);\n}',
        ),
        (
            '.lesson-card[data-chapter="numpy"] .lesson-card__icon {\n  color: var(--chapter-numpy);\n}',
            '.lesson-card[data-chapter="numpy"] .lesson-card__icon {\n  color: var(--chapter-numpy);\n}\n\n.lesson-card[data-chapter="pandas"] .lesson-card__icon {\n  color: var(--chapter-pandas);\n}',
        ),
    ]
    for old, new in replacements:
        if old not in css:
            raise SystemExit(f"CSS pattern not found:\n{old[:80]}")
        css = css.replace(old, new, 1)
    return css


def main() -> None:
    html = INDEX.read_text(encoding="utf-8")
    if 'data-chapter="pandas"' in html:
        raise SystemExit("Pandas chapter already present in index.html")

    html = shift_section_numbers(html, N_SHIFT_START, OFFSET)

    toc = build_toc()
    toc_anchor = '      <div class="toc-chapter" data-chapter="day-13">'
    if toc_anchor not in html:
        raise SystemExit("day-13 TOC anchor not found")
    html = html.replace(toc_anchor, toc + toc_anchor, 1)

    chapter = build_chapter_html()
    day13 = '      <!-- DAY 13 -->'
    if day13 not in html:
        raise SystemExit("DAY 13 marker not found")
    html = html.replace(day13, chapter + "\n" + day13, 1)

    # Update Day 13 notes and Placement Project
    html = html.replace(
        '<p class="chapter-divider__note">Uses NumPy and pandas from the chapter above.</p>',
        '<p class="chapter-divider__note">Uses NumPy and Pandas from the chapters above.</p>',
        1,
    )
    html = html.replace(
        '<p class="chapter-divider__note">Read this before Day 13. NumPy powers the placement project. This bonus chapter does not count as Day 14.</p>',
        '<p class="chapter-divider__note">Read this before the Pandas chapter and Day 13. NumPy powers arrays under Pandas and the placement project. This bonus chapter does not count as Day 14.</p>',
        1,
    )
    old_place = (
        "<p>If you skipped the NumPy chapter above, go back and read it first. "
        "You need <code>import numpy as np</code> for this project.</p>"
    )
    new_place = (
        "<p>If you skipped the NumPy or Pandas chapters above, go back and read them first. "
        "You need <code>import numpy as np</code> and <code>import pandas as pd</code> for this project.</p>"
    )
    if old_place not in html:
        raise SystemExit("Placement Project NumPy note not found after renumber")
    html = html.replace(old_place, new_place, 1)

    # Also update NumPy takeaway that only mentions Day 13
    html = html.replace(
        "<li>NumPy gives fast n dimension arrays. Day 13 and pandas both need it.</li>",
        "<li>NumPy gives fast n dimension arrays. Pandas and Day 13 both need it.</li>",
        1,
    )
    html = html.replace(
        "<p>Read this chapter before Day 13. It does not count toward Day 14.</p>",
        "<p>Read this chapter before Pandas and Day 13. It does not count toward Day 14.</p>",
        1,
    )

    INDEX.write_text(html, encoding="utf-8")
    STYLES.write_text(patch_styles(STYLES.read_text(encoding="utf-8")), encoding="utf-8")
    print(f"OK: inserted {OFFSET} pandas lessons (96-{95+OFFSET})")
    print(f"Day 13 now starts at section {95+OFFSET+1}")


if __name__ == "__main__":
    main()
