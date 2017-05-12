var express = require('express');
var fs = require('fs');
var router = express.Router();

function renderSubdirectoryInfo(path,res,next){
    var base = path;
    fs.readdir(path, function(err,files){
        var finished = 0;
        var fileStats = [];
        var dirs = [];

        dirs.push({ text:'Return to root', url:'/'});

        if(files && files.length){
            files.forEach(function(path){
                if(base !== '/'){
                    path = base + '/' + path;
                }else{
                    path = base + path;
                }

                if(!path){
                    res.render('index', {title:'The Matrix'})
                }else{
                    fs.stat(path, function(err, stats){
                        if (err) {
                            return;
                        }

                        var linkData = {};
                        linkData.text = path;
                        if(stats.isDirectory()){
                            linkData.url = '/viewFolder?path=' + path;
                            dirs.push(linkData);
                        }else{
                            fileStats.push(linkData)
                        }
                        finished++;
                        if(finished === files.length){
                            res.render('index', { title: 'The Matrix', dirs: dirs, files: fileStats });
                        }
                    })
                }
            })
        }else{
            res.render('index', { title: 'The Matrix', dirs:dirs, files: fileStats});
        }

    })
}
router.get('/', function(req, res, next) {
  renderSubdirectoryInfo('/',res,next);
});

router.get('/viewFolder', function(req, res, next) {
    renderSubdirectoryInfo(req.query.path,res,next);
});

module.exports = router;
