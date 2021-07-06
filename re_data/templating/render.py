from jinja2 import Environment, PackageLoader, select_autoescape

env = Environment(
    loader=PackageLoader("re_data"),
    autoescape=select_autoescape()
)

def render_dbt_project(project_name):
    template = env.get_template("dbt_project.yml")
    return template.render(project_name=project_name)