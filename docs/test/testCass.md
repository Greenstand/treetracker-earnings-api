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

  - Organization name: Greenstand
  - Organization ID: 792a4eee-8e18-4750-a56f-91bdec383aa6

- The grower accounts 1

  - Grower account name: Grower One
  - ID: 35a23de8-f1ab-4409-be79-3c6a158d5bde

- The grower accounts 2
  - Grower account name: Grower Two
  - ID: 90eef52b-ad55-4953-ace9-6a324ae6cec2

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

1. Earnings page
