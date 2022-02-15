import pathlib
from setuptools import find_packages, setup

# The directory containing this file
HERE = pathlib.Path(__file__).parent

# The text of the README file
README = (HERE / "README.md").read_text(encoding='utf-8')


setup(
    name="re_data",
    version="0.6.2",
    author="redata-team",
    author_email="mateusz@getre.io",
    description="re_data - data quality framework",
    license="MIT",
    long_description=README,
    long_description_content_type="text/markdown",
    url="https://github.com/re-data/re-data",
    include_package_data=True,
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    install_requires=[
        "click>=8,<9",
        "dbt-core>=0.20.0,<1.1.0",
        "yachalk>=0.1.0,<0.2.0",
        "tabulate==0.8.9",
    ],
    extras_require={"dev": ["isort", "black", "pre-commit"]},
    entry_points={
        "console_scripts": ["re_data=re_data.command_line:main"],
    },
    packages=find_packages(exclude=("tests",))
)
