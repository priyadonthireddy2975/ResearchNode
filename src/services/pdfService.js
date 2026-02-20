import * as pdfjsLib from 'pdfjs-dist';

// Use the local worker path provided by pdfjs-dist
// In Vite, we can import the worker URL directly from the package
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = "";
    const numPages = pdf.numPages;

    for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        fullText += pageText + "\n\n";
    }

    return {
        text: fullText,
        pageCount: numPages
    };
};

export const summarizePaper = (text) => {
    // Mock summarization logic - in a real app, this would call an LLM
    // We'll extract some sentences that look like conclusions or abstracts
    const sentences = text.split(/[.!?]/);
    const abstract = sentences.slice(0, 5).join(". ") + ".";

    return {
        title: "Extracted Research Document",
        abstract,
        keyFindings: [
            "Significant correlation between variable X and Y discovered.",
            "Methodological improvements reduce computational overhead by 30%.",
            "Identified critical gaps in existing longitudinal studies."
        ]
    };
};
