var wn = function($scope)
{
    $scope.version = "0.7 BETA";
    $scope.debug = true;
    $scope.filesystem =  [];
    $scope.editor = ace.edit("e");
    

    $scope.statusContent = {
      "text": "Sin cambios",
      "class": ""
    };

    $scope.languajesHighlight = [
      {
        "name": "CSS",
        "value": "css"
      },
      {
        "name": "JavaScript",
        "value": "javascript"
      },
      {
        "name": "JSON",
        "value": "json"
      },
      {
        "name": "HTML",
        "value": "html"
      },
    ];

    $scope.actualLanguage = $scope.languajesHighlight[1];

    $scope.actualFile = {
      "name": "",
      "content": ""
    };


    $scope.newFileName  = 'newfile-'+ new Date().getTime();

    

    $scope.languageSwitch = function(){
      $scope.editor.getSession().setMode("ace/mode/"+$scope.actualLanguage.name);
    };



    $scope.refreshFileList = function(callback)
    {
      cb = callback;
      $scope.filesystem =  [];
      cd('/').for('*',function(done,file) {
          $scope.filesystem.push(file);
      }).then(function(){
          $scope.$apply();
          if(cb && typeof cb == "function")
          {
              cb();
          }
      });
    };

    $scope.pushFake = function()
    {
      $scope.filesystem.push({"name": "Archivo de test"});
    };

    $scope.openCreate = function()
    {
          $('#fileList').foundation('reveal', 'close');
          $('#myModal').foundation('reveal', 'open');
    };

    $scope.closeCreate = function()
    {
          $('#fileList').foundation('reveal', 'close');
          $('#myModal').foundation('reveal', 'close');
    };

    $scope.createFile = function()
    {
          // SI es un archivo sin nombre que se inenta guardar no le borro el contenido
          if($scope.actualFile.name == '' && $scope.actualFile.content != '');
          {
              $scope.actualFile.content = '';
          }
          $scope.actualFile.name = $scope.newFileName;
          cd('/').write($scope.actualFile.name, $scope.actualFile.content);
          $scope.editor.setValue($scope.actualFile.content);
          $scope.closeCreate();
    };

    $scope.deleteFile = function(file)
    {
        console.log(arguments);
        if(confirm('¿Lo eliminamos?'))
        {
          cd('/').rm( file.name, function(done,res) {
             alert('Fallo la eliminación del archivo');
          }).then(function(){
              $scope.refreshFileList();
          });
        }
    };

    $scope.selectFile = function()
    {
            $('#fileList').foundation('reveal', 'open');
    };

    $scope.loadFile = function(file)
    {
        if(file)
        {
          $scope.actualFile.name = file.name;
          cd('/').read( $scope.actualFile.name, function(done,res) {
           $scope.actualFile.content = res;
              $scope.editor.setValue($scope.actualFile.content);
              $('#fileList').foundation('reveal', 'close');
          });
        }
        else
        {
            $scope.editor.setValue($scope.actualFile.content);
        }
        
    };


    $scope.save = function(){

        $scope.actualFile.content = $scope.editor.getValue();
        if(!$scope.actualFile.name || $scope.actualFile.name == "")
        {
            $scope.createFile();
        }
        else
        {
                $scope.statusContent.text = 'Guardando...';
                $scope.statusContent.class = 'success';

            try {
                //localStorage.setItem('aceSection', e.getValue());
              cd('/').write($scope.actualFile.name,$scope.actualFile.content).then(function(){
                $scope.statusContent.text = 'Guardado';
                $scope.statusContent.class = 'success';
                $scope.$apply();
              });

            } catch(e) {
                $scope.statusContent.text = 'NO SE PUEDE GUARDAR';
                $scope.statusContent.class = 'error';
                $scope.$apply();
                console.error("Error al guardar en local storage - " + e);
            }
        }
    };




    $scope.editor.setTheme("ace/theme/monokai");
    $scope.editor.getSession().setMode("ace/mode/javascript");
    $scope.editor.getSession().on('change', function(){
      $scope.statusContent.text = 'Sin guardar';
      $scope.statusContent.class = '';
      $scope.save();
    });


    setTimeout(function(){
      $scope.refreshFileList(function(){
            if($scope.filesystem.length < 1)
            {
                $scope.createFile();
            }
            else
            {
                $scope.selectFile();
            }
      });

    },2000);


};

