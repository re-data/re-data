readonly VERSION=$(git describe --tags)

helm3 dependency build helm

# TODO:
# Pass version into the Chart.yaml
# Build the chart: helm3 package --version "$VERSION" helm
# Look into where to host the charts??