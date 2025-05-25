# Repo Flattener

This project is a simple tool to flatten a GitHub repository by cloning it, building a file tree, and combining the contents of readable text files into a single output file. This is a "one-shot vibe coded" open-source project designed to facilitate working with code from GitHub repositories within tools like AI Studio by providing a consolidated view of the codebase. Everything, including this readme is ai generated.

## Features

*   Clones a specified GitHub repository (shallow clone for speed).
*   Walks through the repository files, skipping `.git` folders and large binary files.
*   Builds a visual file tree of the included files and directories.
*   Combines the content of text-based files into a single output string, with headers indicating the original file path.
*   Provides a simple web interface to input a GitHub URL and view the results.

## Getting Started

To run this project locally:

1.  Clone the repository:
    ```bash
    git clone <this_repo_url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd repo-flattener # or whatever the directory is named
    ```
3.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```
4.  Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

1.  Open the application in your browser.
2.  Enter the URL of a GitHub repository (e.g., `https://github.com/user/repo`) into the input field.
3.  Click the "Go" button.
4.  The application will process the repository. Once finished, you will see a file tree and a preview of the combined text content.
5.  The combined text content will also be automatically downloaded as `combined.txt`.

This `combined.txt` file provides a flattened representation of the repository's code, which can be useful for pasting into or analyzing with large language models or AI coding assistants.

## Built With

*   [Next.js](https://nextjs.org/) - The React framework for the web
*   [Tailwind CSS](https://tailwindcss.com/) - For styling
*   [Shadcn UI](https://ui.shadcn.com/) - UI components
*   [simple-git](https://github.com/steveukx/git-js) - For cloning repositories
*   [recursive-readdir](https://github.com/painless-software/recursive-readdir) - For walking the file system
*   [file-type](https://github.com/sindresorhus/file-type) - For detecting file types
