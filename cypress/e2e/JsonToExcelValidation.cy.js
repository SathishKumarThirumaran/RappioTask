import moment from "moment";
describe("Json To Excel Data validation", () => {
  it("load data from JSON file and Excel sheet and compare", () => {
    // Load the JSON fixture
    cy.fixture("rapp.json").then((expectedJsonData) => {
      console.log("Loaded JSON Data:", expectedJsonData);

      // Extract values from the JSON data
      const orderName = expectedJsonData.order.orderName;
      const orderNumber = expectedJsonData.order.orderNumber;
      const brand = expectedJsonData.order.brand;
      const endDate = expectedJsonData.order.endDate;

      // Log the specific values from the JSON data
      console.log("Order Name:", orderName);
      console.log("Order Number:", orderNumber);
      console.log("Brand:", brand);
      console.log("EndDate:", endDate);

      // Convert endDate to ISO format in UTC
      const formattedEndDate = moment(endDate, [
        "M/D/YYYY h:mm:ss A",
        moment.ISO_8601,
      ])
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

      console.log("Formatted EndDate:", formattedEndDate); // Check formatted date
      // Check if the date is in the future
      const isFutureDate = moment(formattedEndDate).isAfter(moment());
      console.log("Is Future Date:", isFutureDate);

      // Use the custom command to read the Excel data
      cy.readExcel("rapp.xlsx").then((excelData) => {
        console.log("Excel Data:", excelData);

        // Loop through each row in Excel data and compare the OrderId with JSON orderNumber
        let matchingRow = null;
        excelData.forEach((row, index) => {
          console.log(`Row ${index} - Excel OrderId: '${row.OrderId}'`);

          // Check if the OrderId matches the JSON orderNumber
          if (
            row.OrderId &&
            String(row.OrderId).trim() === String(orderNumber).trim()
          ) {
            console.log(`Match found in row ${index}`);
            matchingRow = row;
          }
        });

        // If a matching row was found, perform assertions
        if (matchingRow) {
          console.log("Found matching row:", matchingRow);

          // Convert the Excel date to ISO format in UTC
          const excelEndDate = moment(matchingRow.FlightEndDate, [
            "M/D/YYYY h:mm:ss A",
            moment.ISO_8601,
          ])
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

          // Validate that the JSON data matches the Excel data
          expect(matchingRow.OrderId).to.equal(orderNumber);
          expect(matchingRow.StepName).to.equal(orderName);
          expect(matchingRow.Brand).to.equal(brand);
          expect(excelEndDate).to.equal(formattedEndDate); // Compare formatted endDate
          expect(isFutureDate).to.be.true;
        } else {
          throw new Error("OrderNumber ${orderNumber} not found in Excel data");
        }
      });
    });
  });
});

//      "endDate": "2025-03-13T00:00:00",
//       Excel  3/31/2025 12:00:00 AM
