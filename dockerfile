# set the base image
FROM ubuntu:20.04

# Update package lists and install prerequisites
RUN apt-get update && \
    apt-get install -y \
    curl \
    gnupg

#install node.js
RUN curl -sL https://deb.nodesource.com/setup_20.x  | bash -
RUN apt-get -y install nodejs


# Set working directory
WORKDIR /app

# Create a non-root user and make sure the home directory exists
RUN groupadd -r lepuser && useradd -r -g lepuser -m lepuser

# Set ownership of the working directory to the non-root user
RUN chown -R lepuser:lepuser /app

# Switch to the non-root user
USER lepuser

# copy everything to /app directory
COPY . ./
COPY package.json ./

# install and cache dependencies
RUN npm install

# expose port 3000 to the outer world
EXPOSE 5000

# start node server
CMD ["node", "index.js"]