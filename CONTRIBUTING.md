# RE Data Contributing Guidelines

Thank you for contributing to RE Data! We value your contributions and will do our best to make sure Issues and PRs are reviewed in a timely fashion.

## Project Setup

The RE Data Framework is spread across two separate GitHub repos, [re-data](https://github.com/re-data/re-data) which hosts the [RE Data Python package](https://pypi.org/project/re-data) and [dbt-re-data](https://github.com/re-data/dbt-re-data) which hosts the [RE Data DBT package](https://hub.getdbt.com/re-data/re_data/latest).

The re-data Python library runs the re_data CLI allowing you to run commands like `re_data overview generate` and also houses the RE Data UI.

The dbt-re-data repo only houses the DBT package. Note the re-data Toy Shop tutorial in the re-data repo imports the RE Data DBT package directly from the `main` branch of the dbt-re-data GitHub repo in the [`getting_started/toy_shop/packages.yml`](getting_started/toy_shop/packages.yml) file.

Since these repos are interdependent many changes to one repo will require a change in the other. If you find yourself hopping between repos often one trick is to import the dbt-re-data repo you have locally into the [`getting_started/toy_shop/packages.yml`](getting_started/toy_shop/packages.yml) instead of the version hosted on GitHub. See the [DBT Docs here](https://docs.getdbt.com/docs/build/packages#local-packages) for how to configure local packages in the profiles.yml.

## Developing Locally

### Installations

- [make](https://www.gnu.org/software/make)
- [act](https://github.com/nektos/act#installation)
- [Docker](https://docs.docker.com/engine/install)

This repo has a [Makefile](Makefile) that can be used to run most CLI commands you will need while developing. The first couple commands of the Makefile use [act](https://github.com/nektos/act#installation) to run the GitHub Actions CI Jobs locally. 

RE Data runs locally on a Postgres database that is spun up on your local machine using Docker. RE Data supports several other data warehouses that cannot be spun up locally thus any CI jobs that involve making a connection to BigQuery, Redshift, or Snowflake will not run locally and will only run as part of the CI in GitHub.

The middle section of the Makefile is used to run Postgres locally and run the example DBT project for the Toy Shop in the [`getting_started/toy_shop`](getting_started/toy_shop) directory. After running `make setup-toy-shop` there will be a few JSON files in the `target/re_data` directory in [`getting_started/toy_shop`](getting_started/toy_shop). These files are the RE Data artifacts that are read into the UI. Run `make copy-artifacts` to copy these files to the [`re_data_ui/public`](re_data_ui/public) directory so that the UI can read them in.

The last part of the Makefile helps you to spin the RE Data UI up locally. The RE Data UI is essentially a static React app. It reads in the RE Data artifacts from the public folder then displays them in various visuals.

Once all of your changes are made, aside from running all of the GitHub Actions CI jobs you can set up the Toy Shop and run the UI. The UI should closely match the [hosted Demo UI](https://docs.getre.io/ui-latest) plus any changes you've made.

### Versions Should Match

There are different versions of DBT, Python and Node throughout both repos make sure they all match. Below are the places to double check versions match:

- The `env` variables in the GitHub Actions files
- Any `packages.yml` files
- Any `requirements.txt` files

## [dbt-re-data](https://github.com/re-data/dbt-re-data) Repo

The dbt-re-data repo also contains a Makefile that is used to run both of the GitHub Actions CI jobs. The re-data repo imports the dbt-re-data repo as a dependency, but not vice versa. The dbt-re-data repo has several PyTests that essentially run the same workflow of setting up the Toy Shop in the background.

## Issues and Pull Requests

All Issues for both repos are held in the [re-data](https://github.com/re-data/re-data/issues) repo. Most issues are either a Bug or a Feature. Please make an Issue and fill out the template before making a Pull Request. We will try to get your Pull Requests merged in a timely fashion. Always feel free to reach out in [Slack](https://join.slack.com/t/re-data/shared_invite/zt-vkauq1y8-tL4R4_H5nZoVvyXyy0hdug).
