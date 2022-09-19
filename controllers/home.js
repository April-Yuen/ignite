module.exports = {
    getIndex: (req, res) => {
      res.render("index.ejs", {title: 'Ignite Login Portal', layout: './layouts/setup'});
    },
};
  