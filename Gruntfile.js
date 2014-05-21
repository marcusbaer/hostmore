module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            all: {
                files: ["webapp/**/*", "jade/**/*"],
                tasks: ["default"],
                options: {
                    nospawn: true,
                    interrupt: false,
                    debounceDelay: 250
                }
            }
        },
        reload: {
            port: 35729,
            liveReload: {},
            proxy: {
                host: "localhost",
                port: 9090
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-reload");

    grunt.registerTask("default", ["reload", "watch"]);
};