module.exports = {
    Root: '..',
    SetRoot: function(root) {
        this.Root = root;
    },

    GetRoot: function() {
        return this.Root;
    },

    GetPath: function(args) {
        var result = [__dirname, this.Root];
        result = result.concat(args);
        return result.join('/');
    }
};