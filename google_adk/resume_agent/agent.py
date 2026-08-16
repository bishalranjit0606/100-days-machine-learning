"""Resume agent.

Takes a resume and a job description, then writes a new resume that fits the job.
Run from the google_adk folder:

    adk web
    adk run resume_agent
    adk api_server
"""

from pathlib import Path

from google.adk.agents.llm_agent import Agent

AGENT_DIR = Path(__file__).resolve().parent


def read_file(path: str) -> dict:
    """Read a resume or job description from a text file.

    Args:
        path: File path. Absolute, or relative to the resume_agent folder.

    Returns:
        status, path, and the file text.
    """
    file_path = Path(path).expanduser()
    if not file_path.is_absolute():
        file_path = AGENT_DIR / file_path

    if not file_path.exists():
        return {"status": "error", "error": f"File not found: {file_path}"}
    if not file_path.is_file():
        return {"status": "error", "error": f"Not a file: {file_path}"}

    try:
        text = file_path.read_text(encoding="utf-8")
    except OSError as exc:
        return {"status": "error", "error": str(exc)}

    if not text.strip():
        return {"status": "error", "error": f"File is empty: {file_path}"}

    return {"status": "success", "path": str(file_path), "text": text}


def save_resume(content: str, path: str = "tailored_resume.md") -> dict:
    """Save the rewritten resume to a file.

    Args:
        content: Full tailored resume text.
        path: Where to write it. Default is tailored_resume.md in this folder.

    Returns:
        status and the saved path.
    """
    if not content or not content.strip():
        return {"status": "error", "error": "Resume content is empty."}

    file_path = Path(path).expanduser()
    if not file_path.is_absolute():
        file_path = AGENT_DIR / file_path

    try:
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(content.strip() + "\n", encoding="utf-8")
    except OSError as exc:
        return {"status": "error", "error": str(exc)}

    return {"status": "success", "path": str(file_path)}


root_agent = Agent(
    model="gemini-2.5-flash",
    name="resume_agent",
    description=(
        "Takes a resume and a job description, then writes a new resume "
        "that fits the job."
    ),
    instruction="""
You are a resume rewrite agent.

Goal: take the person's current resume and the target job description, then
write a new resume aimed at that job.

Steps:
1. Get the current resume and the job description.
   If the user gives file paths, call read_file for each path.
   If the text is already in the chat, use that text. Do not ask again.
   If either piece is missing, ask for it.
2. Match the resume to the job.
   Pull out the skills, tools, and duties the job asks for.
   Keep only facts that already appear in the original resume.
   Reorder sections and bullets so the strongest matches come first.
   Rephrase bullets so they use the job's language.
3. Write a complete new resume in markdown:
   - Name and contact
   - Short summary aimed at this role
   - Skills
   - Experience
   - Education
   - Projects or extra sections only if they were in the original resume
4. Call save_resume with the full new resume text.
5. Show the new resume to the user. Also tell them the saved file path.

Rules:
- Never invent jobs, titles, dates, degrees, companies, metrics, or skills.
- If the original resume does not cover something the job wants, skip it.
  Do not fake it.
- Do not copy the job description word for word as if it were the person's work.
- Keep the tone professional and clear.
- Prefer short bullets that start with a strong verb.
""".strip(),
    tools=[read_file, save_resume],
)
