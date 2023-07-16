class JobSpecDocker {
    image;
    entrypoint;
    working_directory;

    constructor({ image, entrypoint, working_directory }) {
        this.image = image;
        this.entrypoint = entrypoint;
        this.working_directory = working_directory
    }

    toJson() {
        return {
            image: this.image,
            entrypoint: this.entrypoint,
            working_directory: this.working_directory
        }
    }
}

module.exports = { JobSpecDocker }