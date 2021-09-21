mkdir test_re_data
echo "test_re_data" >> test_re_data/.python-version
pyenv virtualenv test_re_data
cd test_re_data
pip install re_data
