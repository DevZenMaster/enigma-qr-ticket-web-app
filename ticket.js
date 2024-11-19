document.addEventListener('DOMContentLoaded', () => {

    const { jsPDF } = window.jspdf;

    // Retrieve data and QR code URL from localStorage
    const data = JSON.parse(localStorage.getItem('qrData') || '{}');
    const qrCodeUrl = localStorage.getItem('qrCodeUrl');

    console.log('QR Data:', data);
    console.log('QR Code URL:', qrCodeUrl);

    // Fill in ticket details
    const firstNameElem = document.getElementById('first-name');
    const lastNameElem = document.getElementById('last-name');
    const centerElem = document.getElementById('center');
    const studentIdElem = document.getElementById('student-id');
    const centerTypeElem = document.getElementById('center-type');
    const teamElem = document.getElementById('team');
    const qrElement = document.getElementById('qrcode');

    if (firstNameElem) firstNameElem.textContent = data.firstName || '';
    if (lastNameElem) lastNameElem.textContent = data.lastName || '';
    if (centerElem) centerElem.textContent = data.center || '';
    if (studentIdElem) studentIdElem.textContent = data.studentId || '';
    if (centerTypeElem) centerTypeElem.textContent = data.centerType || '';
    if (teamElem) teamElem.textContent = data.team || '';

    // Display QR code if available
    if (qrCodeUrl && qrElement) {
        const img = document.createElement('img');
        img.src = qrCodeUrl;
        img.alt = 'QR Code';
        qrElement.appendChild(img);
    }

    // Back button functionality
    const backButton = document.getElementById('back-btn');
    if (backButton) {
        backButton.addEventListener('click', () => {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = '/';
            }
        });
    } else {
        console.error('Back button not found.');
    }

    // Download button functionality
    const downloadButton = document.getElementById('download-btn');
    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            try {
                const doc = new jsPDF();
                const pageWidth = doc.internal.pageSize.width;

                // Define dimensions for logos
                const logoWidth = 40;
                const logoHeight = 20;
                const margin = 10;

                // Calculate positions for inline logos
                const logoX1 = pageWidth - logoWidth - margin; // Position for the second logo
                const logoY = 5; // Top margin

                // Add Header Logo
                const logo2 = 'images/SLTC_Logo.png'; // Path to the second logo

                // Add second logo
                doc.addImage(logo2, 'PNG', logoX1, logoY, logoWidth, logoHeight);

                // Add Photo before Ticket Image
                const photoPath = 'images/enigma.png'; // Path to the new photo
                const photoWidth = 190;
                const photoHeight = 50;
                const photoX = 10; // X position
                const photoY = logoY + logoHeight + 5; // Y position (below the logo)

                doc.addImage(photoPath, 'PNG', photoX, photoY, photoWidth, photoHeight);

                // Add Ticket Image below the new photo
                const ticketImageY = photoY + photoHeight + 10; // Space between photo and ticket image
                doc.addImage('images/ticket.jpg', 'JPEG', 10, ticketImageY, 190, 70);

                // Add Ticket Details Table after the image
                const tableData = [
                    ['Event Name', 'Enigma 2k24'],
                    ['First Name', data.firstName || ''],
                    ['Last Name', data.lastName || ''],
                    ['Center', data.center || ''],
                    ['Student ID', data.studentId || ''],
                    ['Center Type', data.centerType || ''],
                    ['Team', data.team || '']
                ];

                const tableStartY = ticketImageY + 80; // Positioned below the ticket image
                const tableX = (pageWidth - 80) / 2; // Adjust to center the table

                tableData.forEach(([label, value], index) => {
                    doc.setFontSize(12);
                    doc.setFont("Helvetica", "normal");
                    doc.text(`${label}:`, tableX, tableStartY + (index * 10));
                    doc.text(value, tableX + 50, tableStartY + (index * 10));
                });

                // Add QR code
                if (qrCodeUrl) {
                    const img = new Image();
                    img.crossOrigin = 'Anonymous';
                    img.src = qrCodeUrl;

                    img.onload = () => {
                        const qrCodeWidth = 50;
                        const qrCodeHeight = 50;
                        const qrCodeX = (pageWidth - qrCodeWidth) / 2;
                        doc.addImage(img, 'PNG', qrCodeX, tableStartY + 65, qrCodeWidth, qrCodeHeight);
                        
                        // Save the PDF and add images after the first page
                        savePdfWithAdditionalImages(doc);
                    };

                    img.onerror = (error) => {
                        console.error('Failed to load QR code image:', error);
                        alert('An error occurred while loading the QR code image.');
                    };
                } else {
                    // Save the PDF without QR code if the URL is missing
                    savePdfWithAdditionalImages(doc);
                }
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('An error occurred while generating the PDF.');
            }
        });
    } else {
        console.error('Download button not found.');
    }

    // Function to save the PDF with additional images
    function savePdfWithAdditionalImages(doc) {
        const images = [
            'images/1.jpg',
            'images/2.jpg',
            'images/3.jpg',
            'images/4.jpg',
            'images/5.jpg'
        ];

        images.forEach((image, index) => {
            doc.addPage();
            doc.addImage(image, 'JPEG', 10, 10, 190, 270);
        });

        doc.save('ticket.pdf');
    }

});
