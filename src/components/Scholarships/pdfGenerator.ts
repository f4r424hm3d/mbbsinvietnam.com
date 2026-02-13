export const generateScholarshipPDF = async (data: any) => {
  console.log('Generating PDF with data:', data);
  // Simulate PDF generation
  await new Promise(resolve => setTimeout(resolve, 2000));
  alert('PDF generated and downloaded!');
};