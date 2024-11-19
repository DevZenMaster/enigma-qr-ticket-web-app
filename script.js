const form = document.getElementById("generate-form");
const qr = document.getElementById("qrcode");
const resetBtn = document.getElementById("reset-btn");
const spinner = document.getElementById("spinner");

const onGenerateSubmit = (e) => {
  e.preventDefault();
  clearUI();

  // Get values from the form inputs
  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const center = document.getElementById("center").value;
  const studentId = document.getElementById("student-id").value;
  const size = document.getElementById("size").value;
  const centerType = document.querySelector('input[name="center-type"]:checked')?.value;
  const team = document.querySelector('input[name="team"]:checked')?.value;

  // Check if all fields are filled
  let errorMessage = "Please fill in all fields:";
  let hasError = false;

  if (!firstName) {
    errorMessage += "\n- First Name";
    hasError = true;
  }
  if (!lastName) {
    errorMessage += "\n- Last Name";
    hasError = true;
  }
  if (!center) {
    errorMessage += "\n- Center";
    hasError = true;
  }
  if (!studentId) {
    errorMessage += "\n- Student ID";
    hasError = true;
  }
  if (!centerType) {
    errorMessage += "\n- Center Type";
    hasError = true;
  }
  if (!team) {
    errorMessage += "\n- team";
    hasError = true;
  }

  if (hasError) {
    alert(errorMessage);
    return;
  }
  
  // Prepare data for QR code
  const data = {
    firstName,
    lastName,
    center,
    studentId,
    centerType,
    team
  };

  showSpinner();

  setTimeout(() => {
    hideSpinner();
    generateQRCode(JSON.stringify(data), size);
    setTimeout(() => {
      const qrImage = qr.querySelector("img");
      if (qrImage) {
        const saveUrl = qrImage.src;
        localStorage.setItem('qrData', JSON.stringify(data));
        localStorage.setItem('qrCodeUrl', saveUrl);
        createDownloadBtn(saveUrl);
        window.location.href = 'ticket.html'; // Navigate to ticket page
      }
    }, 50);
  }, 1000);
};

const generateQRCode = (data, size) => {
  // Clear previous QR code if it exists
  qr.innerHTML = "";
  new QRCode(qr, {
    text: data,
    width: size,
    height: size,
  });
};

const showSpinner = function () {
  spinner.style.display = "block";
};

const hideSpinner = function () {
  spinner.style.display = "none";
};

const clearUI = function () {
  qr.innerHTML = "";
  const downloadBtn = document.getElementById("downloadlink");
  if (downloadBtn) {
    downloadBtn.remove();
  }
};

const createDownloadBtn = function (downloadUrl) {
  // Remove old download button if it exists
  const oldDownloadBtn = document.getElementById("downloadlink");
  if (oldDownloadBtn) {
    oldDownloadBtn.remove();
  }

  const link = document.createElement("a");
  link.id = "downloadlink";
  link.classList = "download-btn";
  link.href = downloadUrl;
  link.download = "qrcode.png"; // Ensure the file extension is included
  link.innerHTML = "Download";
  document.getElementById("generated").appendChild(link);
};

form.addEventListener("submit", onGenerateSubmit);
resetBtn.addEventListener("click", () => {
  form.reset();
  clearUI();
  hideSpinner();
});










