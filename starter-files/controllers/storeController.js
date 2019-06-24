// writing middleware requires the 'next' parameter
exports.myMiddleware = (req, res, next) => {
    req.name = 'bruh';
    next(); // middleware done, pass it to next piece
}

exports.homePage = (req, res) => {
    // console.log(req.name);
    res.render('index');
};