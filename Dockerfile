# Use the latest version of Node.js
#
# You may prefer the full image:
# FROM node
#
# or even an alpine image (a smaller, faster, less-feature-complete image):
# FROM node:alpine
#
# You can specify a version:
# FROM node:10-slim
FROM node:10

# Labels for GitHub to read your action
LABEL "com.github.actions.name"="Timestep Release"
LABEL "com.github.actions.description"="Publish a new version to NPM"
# Here all of the available icons: https://feathericons.com/
LABEL "com.github.actions.icon"="[package]"
# And all of the available colors: https://developer.github.com/actions/creating-github-actions/creating-a-docker-container/#label
LABEL "com.github.actions.color"="gray-dark"

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your action's code
COPY . .

# Run `node /src/index.js`
ENTRYPOINT ["node", "/src/index.js"]
