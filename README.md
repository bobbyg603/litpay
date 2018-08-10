# litpay

## Prerequisites

Ensure the following prerequisites are met before you start development:

1. Install serverless
```shell
npm i -g serverless
```
2. Add a litpay profile to your aws credentials file
```
[litpay]
aws_access_key_id = xxx
aws_secret_access_key = xxx
```

## Getting Started

The following steps will get you up and running with a litpay development environment:

1. Clone the repository and set litpay as your current directory
```shell
git clone https://github.com/bobbyg603/litpay && cd litpay
```
2. Checkout the development branch
```shell
git checkout development
```
3. Install the npm packages
```shell
npm install
```
4. Run the tests to ensure everything installed properly
```shell
npm test
```

## Next steps

1. Please fork the repo or create a branch from development when working on a feature or bugfix.
2. Please ensure all changes have 90% or greater unit test coverage.
```shell
npm run testWithCoverage
```
3. Submit a pull request when your feature is ready for review.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details