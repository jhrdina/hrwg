const getEl = (selector: string) => window.document.querySelector(selector);

const fileInputEl = getEl("#fileInput") as HTMLInputElement;
const currentWordEl = getEl("#currentWord") as HTMLDivElement;
const openButtonEl = getEl("#openButton") as HTMLButtonElement;
const nextButtonEl = getEl("#nextButton") as HTMLButtonElement;
const logoEl = getEl("#logo") as HTMLImageElement;

// STATE MANAGEMENT

type State = {
  attemptedUpload: boolean;
  allLines: string[];
  remainingLines: string[];
};

let state: State = {
  attemptedUpload: false,
  allLines: [],
  remainingLines: [],
};

const onNextClick = () => {
  if (state.remainingLines.length < 1) {
    state.remainingLines = shuffleArray(state.allLines);
  }

  const currentLine = state.remainingLines.pop();
  if (!currentLine) {
    return;
  }

  currentWordEl.innerText = currentLine;
};

const shuffleArray = <T>(array: T[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

fileInputEl.addEventListener("change", (event) => {
  const fileList = (event.target as HTMLInputElement).files;
  const reader = new FileReader();
  reader.addEventListener("load", (event) => {
    const lines = (event.target.result as string)
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
    state = {
      attemptedUpload: true,
      allLines: lines,
      remainingLines: [],
    };
    logoEl.classList.add("hidden");
    currentWordEl.classList.remove("hidden");
    openButtonEl.classList.add("hidden");
    nextButtonEl.classList.remove("hidden");
    onNextClick();
    nextButtonEl.focus();
  });
  reader.readAsText(fileList[0]);
});

const openFileChooser = () => {
  fileInputEl.click();
};

logoEl.addEventListener("click", openFileChooser);
openButtonEl.addEventListener("click", openFileChooser);
nextButtonEl.addEventListener("click", onNextClick);
