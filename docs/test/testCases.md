# The Test Cases for the Earnings

# About the earnings feature

## The Formula of the amount of payment

- If the captures count less than 100, the amount of payment is 0;

- The maximum amount of payment is 1200000;

- The amount = ((capture_count - capture_count mod 100) / 10 / 100 ) \* 1200000;

## The workflow of the payment

- Download the `earnings` record from earnings page.

- Manually populate the CSV file downloaded from the earnings page.

- Upload the CSV file to payment page.

- Done.

# How to generate new earnings

To generate new record of earnings for testing:

- Go to this url:
  https://github.com/Greenstand/treetracker-earnings-api/actions/workflows/treetracker-api-test-tool.yml

- Click the button "Run workflow"

- Input the parameters, as picture below:

![](https://dadior.s3.ap-northeast-1.amazonaws.com/20220312161220.png)

Please wait the Action to finish, if the Action that you just created is finished successfully, you will find a green check mark. If not, there is a red cross mark. To know what happened with the failed Action, click it and check the log, the output would give some clue of what happened, send the link to developer if you can not figure out what's wrong.

![](https://dadior.s3.ap-northeast-1.amazonaws.com/20220312162205.png)

If everything is okay,you will find new earnings in the `earnings` page.

https://dev-admin.treetracker.org/earnings

![](https://dadior.s3.ap-northeast-1.amazonaws.com/20220312162425.png)

# Test Story

# Test Cases

To do the test, we need some test data for example, the organization and grower/planter accounts, there is the pre-generated data for this.

## For the development environment

- The major organization

  - Organization name: FCC
  - Organization ID: ae7faf5d-46e2-4944-a6f9-5e65986b2e03

- The grower accounts 1

  - Grower account name: Grower One
  - ID: 35a23de8-f1ab-4409-be79-3c6a158d5bde

- The grower accounts 2
  - Grower account name: Grower Two
  - ID: 90eef52b-ad55-4953-ace9-6a324ae6cec2

- Sub organization
  
  -- Organization: FCCABC
  -- ID: 8b353fbe-0ad7-46a6-ad43-27e304a95757

- Sub organization
  
  -- Organization: FCCDEF
  -- ID: ce14d9b7-92c3-450b-9779-2bb731c5aefc

## For the test environment

- The major organization /funder

  - Organization name: FCC
  - Organization ID: df12ea71-65e6-4059-b4f5-60c675764497

- The grower accounts 1

  - Grower account name: Freetown A
  - ID: 9d582e43-7a7a-44b4-8d40-848b6b490bf0

- The grower accounts 2

  - Grower account name: Selmer Bauch
  - ID: f5a17d5a-e6e0-4ae9-b700-1c6fe62a5ffa

- The sub-organization

  - Sub-organization name: FCCDEF
  - Sub-organization ID: d523df4e-7fcd-4cd3-acb7-05b48e0939b8

- The sub-organization

  - Sub-organization name: FCCABC
  - Sub-organization ID: 894e4a9a-3a85-46ea-ba8c-6c00689503f3

## For the test environment

# Teat Case

1. Earnings page displays correctly

   Below information should be displayed correctly.

   - Grower name
   - Funder name
   - Sub organization name
   - Amount
   - Captures count
   - Effective Date
   - Status
   - Payment Date

1. Earnings page: detail page is correct

   By clicking every line of the list, should be able to display the detail of the earnings record.

   - Grower name
   - Funder name
   - Sub organization name
   - Amount of payment
   - Currency
   - Capture account
   - Status
   - Effective date
   - Payment date
   - Consolidation type
   - Consolidation period
   - Payment confirmation id
   - Payment method
   - Payment confirmed by
   - Payment confirmation method

1. Earnings page: filter works correctly

   The filter button can correctly filter the data by:

   - Status
   - Sub Organization
   - Grower phone number
   - Grower name

1. Earnings page: Date Range works correctly

   The date range filter can correctly filter the data by:

   - Effective Date

1. Earnings page: single payment log works correctly

   When open the detail panel (on the right), at the bottom of the page, input the payment confirmed ID and payment method, click 'LOG', should be able to successfully log the payment.

1. Earnings page: pagination works correctly

   Can do pagination correctly when number of items grows.

1. Earnings page: export successfully.

   The export button can export the data correctly, the download file should be in CSV format with columns:

   - Earnings ID
   - Worker/Grower ID
   - Phone number
   - Currency
   - Amount
   - Captures count
   - `Empty` payment confirmation id
   - `Empty` payment method
   - `Empty` paid at

1. Payment page: list item should display information correctly.

   The list should be displayed correctly with columns:

   - Grower name
   - Funder name
   - Amount of payment
   - Count of captures
   - Effective date
   - Payment method
   - Status
   - Payment date

1. Payment page: pagination should work correctly.

   The pagination should work correctly when number of items grows.

1. Payment page: The filter function should works correctly.

   Just as the Earnings page do. (Refer to the same function in the earnings page)

1. Payment page: The date range filter should works correctly.

   Just as the Earnings page do. (Refer to the same function in the earnings page)

1. Payment page: be able to upload the payment csv file correctly.

   On the payment page, after downloading the CSV file, and populated the appropriate columns, upload the CSV file to the payment page, should be able to finish the payment correctly.

1. Earnings page, edge case: different earning records should works correctly.

   Compose different earning records, and check the result, for example:

   - The capture count less than 100, the amount of payment should be 0.
   - The maximum amount of payment is 1200000.

   And please also check all those features about Earings page listed above are working correctly. All also, the earnings could be paid correctly.

1. Payment page, edge case: different payment records should works correctly.

   Compose different payment records, and check the result, for example:

   - Upload all kinds of broken/wrong files, should be able to see the error message.
     The cases could be, for example:
     - Wrong file format
     - Wrong file content
     - Wrong file structure
     - Wrong file header
     - Wrong file column
     - Wrong file column name
     - Wrong file column type
     - Wrong file column value
     - Missing file column
     - Missing column values
