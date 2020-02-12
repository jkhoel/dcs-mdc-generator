const FileWriter = (fileName, content, contentType) => {
  const element = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  element.href = URL.createObjectURL(file);
  element.download = fileName;

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

module.exports = FileWriter;