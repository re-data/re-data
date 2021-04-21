from setuptools import find_packages, setup

# The directory containing this file
# HERE = pathlib.Path(__file__).parent

# The text of the README file
# README = (HERE / "README.md").read_text()


setup(
    version="0.0.5",
    author="redata-team",
    description="Monitoring system for data teams",
    name="re_data",
    install_requires=[
        "click",
    	"dbt",
        "grpcio"
    ],
    extras_require={"dev": ["isort", "black", "pre-commit"]},
    entry_points={
        "console_scripts": ["redata=redata.command_line:main"],
    },
    packages=find_packages(),
)
