describe("Excel Validation with Custom Command", () => {
    it("load data from JSON file and Excel sheet and compare", () => {
      // Load the JSON fixture
      cy.fixture("rapp.json").then((expectedJsonData) => {
        console.log("Loaded JSON Data:", expectedJsonData);
  
        // Extract values from the JSON data
        const orderName = expectedJsonData.order.orderName;
        const orderNumber = expectedJsonData.order.orderNumber;
        const brand = expectedJsonData.order.brand;
  
        // Log the specific values from the JSON data
        console.log("Order Name:", orderName);
        console.log("Order Number:", orderNumber);
        console.log("Brand:", brand);
  
        // Use the custom command to read the Excel data
        cy.readExcel("rapp.xlsx").then((excelData) => {
          console.log("Excel Data:", excelData);
  
          // Loop through each row in Excel data and compare the OrderId with JSON orderNumber
          let matchingRow = null;
          excelData.forEach((row, index) => {
            console.log("Row ${index} - Excel OrderId: '${row.OrderId}'");
  
            // Check if the OrderId matches the JSON orderNumber
            if (
              row.OrderId &&
              String(row.OrderId).trim() === String(orderNumber).trim()
            ) {
              console.log('Match found in row ${index}');
              matchingRow = row;
            }
          });
  
          // If a matching row was found, perform assertions
          if (matchingRow) {
            console.log('Found matching row:', matchingRow);
  
            // Validate that the JSON data matches the Excel data
            expect(matchingRow.OrderId).to.equal(orderNumber);
            expect(matchingRow.StepName).to.equal(orderName);
            expect(matchingRow.Brand).to.equal(brand);
          } else {
            throw new Error('OrderNumber ${orderNumber} not found in Excel data');
          }
        });
      });
    });
  });
  