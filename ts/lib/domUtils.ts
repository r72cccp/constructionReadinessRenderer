const insertHtmlToElementById = (id: string, html: string): void => {
  const domElement = document.getElementById(id)
  domElement.innerHTML = html;
};

export const domUtils = {
  insertHtmlToElementById,
};