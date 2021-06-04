from setuptools import find_packages, setup

# The directory containing this file
# HERE = pathlib.Path(__file__).parent

# The text of the README file
# README = (HERE / "README.md").read_text()


setup(
    version="0.1.0",
    author="redata-team",
    description="Monitoring system for data teams",
    name="re_data",
    install_requires=[
        "click>=7.1.2,<8.0.0",
    	"dbt>=0.19.1,<0.20.0",
        "grpcio==1.37.0"
    ],
    extras_require={"dev": ["isort", "black", "pre-commit"]},
    entry_points={
        "console_scripts": ["re_data=re_data.command_line:main"],
    },
    packages=find_packages(),
)
