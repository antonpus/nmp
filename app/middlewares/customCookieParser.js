const customCookieParser = (req, res, next) => {
    req.parsedCookies = req.cookies;
    console.log(`Cookies: ${JSON.stringify(req.parsedCookies)}`);
    next();
};

export default customCookieParser;