# CAS Builder - Client Acquisition System

A specialized, intelligent "quiz funnel" application that helps service businesses architect their client acquisition infrastructure before purchasing software tools. It assesses business type, sales model, and lead behavior to generate a custom system blueprint.

## Features

- **2-Stage Progressive Profiling**: Foundation questions followed by behavioral logic adaptation.
- **Dynamic Blueprint Generation**: Visually mapped system steps with "reasoning" based on user input.
- **Intelligent Tool Consolidation**: Calculates fragmented tool costs vs. consolidated platform (GoHighLevel) savings.
- **State Persistence**: Saves user progress automatically using LocalStorage.
- **PDF Export**: Generates a downloadable system report.
- **Responsive Design**: Mobile-first UI built with Tailwind CSS.

## Setup & Development

This project uses React and Vite.

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Locally**:
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` (or the port shown).

## Deployment

This app is platform-agnostic and can be deployed to any static hosting provider.

**Vercel / Netlify**:
1.  Connect your GitHub repository.
2.  The platform will automatically detect the `package.json` and build using `npm run build`.
3.  Publish directory: `dist`.

**GitHub Pages**:
1.  Configure a workflow to build and deploy the `dist` folder, or use the `gh-pages` package.

## Logic Customization

- **Questions**: Modify `STAGE_1_QUESTIONS` and `STAGE_2_QUESTIONS` in `constants.ts`.
- **System Logic**: The `generateBlueprint` function in `constants.ts` contains the decision tree that maps answers to system steps.
- **Tool Data**: `MARKET_STACK_DATA` in `constants.ts` controls the competitor pricing examples.

## Persistence & Export

- **Persistence**: Implemented in `App.tsx` using `localStorage` key `cas_builder_state_v1`. It saves on every state change.
- **PDF Export**: Implemented in `Results.tsx` using `html2canvas` to screenshot the DOM node and `jsPDF` to generate the file.

## License

MIT