
# dbt docs

## overview

Dbt docs help you share documentation about your data with your team and other shareholderes in the company.

You can generate dbt docs from your dbt project. Dbt allows you also to add descriptions to each of the tables, columns, macros.

Below example of how generated documentation looks like:

![dbt_docs_example](/re_cloud/integrations/dbt_docs.png)

More information on generating dbt docs is available on [dbt pages](https://docs.getdbt.com/docs/building-a-dbt-project/documentation)

## uploading to re_cloud

In order to effectively work with dbt docs it's crucial to share it with other people in the company.
re_cloud makes it super easy. The simplest way to do it is to run commands below in your dbt project:


```
dbt docs generate
re_cloud upload dbt-docs
```

## re_cloud command 

Below we show all the currently supported options on how you can upload dbt-docs to `re_cloud`

```
re_cloud upload dbt-docs --name TEXT --project-dir TEXT

Options:
  --project-dir TEXT  Which directory to look in for the dbt_project.yml file.
                      Default is the current working directory and its parents
  --name TEXT         Name of the upload used for identification
```

You don't need to pass project-dir paramter if calling this command from witin dbt main directory. Otherwise pass `project-dir` to upload generated docs from this directory.