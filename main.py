import random
from typing import Union

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from starlette.responses import FileResponse

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")


class QuestionRequest(BaseModel):
    question: str
    language: str


class FeedbackRequest(BaseModel):
    feedback: int
    response: str


# @app.post("/question")
# async def get_answer(question: QuestionRequest) -> dict[str, Union[str, int]]:  # noqa: UP007
#     return {"answer": f"{question.question}", "feedback": random.randint(100000, 999999)}  # noqa: S311
#
#
# @app.post("/feedback")
# async def submit_feedback(feedback: FeedbackRequest) -> dict[str, Union[str, int]]:  # noqa: UP007
#     return {"Message": f"feedback: {feedback.feedback}, response: {feedback.response}"}


@app.get("/")
async def get_index_html() -> FileResponse:
    return FileResponse("static/index.html")


def main() -> None:
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)  # noqa: S104


if __name__ == "__main__":
    main()
