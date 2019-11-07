module.exports = function(title,content)
{
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${title}</title>
</head>
<body>
    <main>
        ${content}
    </main>
    <script src="main.js"></script>
</body>
</html>
`
}