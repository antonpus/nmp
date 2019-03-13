const customQueryParser = (req, res, next) => {
    req.parsedQuery = req.query;
    console.log(`Query: ${JSON.stringify(req.parsedQuery)}`);
    next();
};

export default customQueryParser;