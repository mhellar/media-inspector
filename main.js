var app = require('app'); // Module to control application life.
var BrowserWindow = require('browser-window'); // Module to create native browser window.
var ipc = require('ipc');
var sha1File = require('sha1-file');
var dialog = require('dialog');
var XML = require('pixl-xml');
var minfo = './mediainfo -f --Output=XML ';
var elements = [];
var exec = require('child_process').exec;
var fs = require("fs");

ipc.on('message', function(event, arg) {
    console.log(arg); // prints "ping"
    if (arg == "open") {
        chooseFile();
    }
});

function escapeShellArg (cmd) {
    return '\'' + cmd.replace(/\'/g, "'\\''") + '\'';
}

function chooseFile() {
    console.log(dialog.showOpenDialog({
       properties: [ 'openFile', 'multiSelections' ]
    }, function(filename) {
        console.log(filename[0]);
        var file = escapeShellArg(filename[0]);
        var sumRes = createHash(filename[0]); 
        mainWindow.webContents.send('data',file);

        exec(minfo + file, function(error, stdout, stderr) {
        
        var doc = XML.parse(stdout);
        try {
            if (typeof doc.File.track[0].File_name != undefined) {
                elements[1] = "Media report for : " + doc.File.track[0].File_name + "." + doc.File.track[0].File_extension + "  \n";
                console.log(elements[1]);
                mainWindow.webContents.send('data',elements[1]);
            }
        } catch (e) {
            console.log(e);
            var FileName = "No Data";
        }

        try {
            if (typeof doc.File.track[0].File_last_modification_date) {
                elements[2] = "Last Modification Date : " + doc.File.track[0].File_last_modification_date + "  \n";
                var ModDate = doc.File.track[0].File_last_modification_date;
                console.log(elements[2]);
                mainWindow.webContents.send('data',elements[2]);
            }
        } catch (e) {
            console.log(e);
            var ModDate = "No Data";
        }
        elements[2] = "Checksum Algorithm : SHA-1  \n";
        try {
            if (typeof doc.File.track[0].Writing_application[1] !== undefined) {
                elements[4] = "Writing Application : " + doc.File.track[0].Writing_application[1] + "  \n";
                var WritingApp = doc.File.track[0].Writing_application[1];
                mainWindow.webContents.send('data',elements[4]);
            }
        } catch (e) {
            console.log(e);
            var WritingApp = "No Data";
        }
        try {
            if (typeof doc.File.track[0].File_extension !== undefined) {
                elements[5] = "File Extension : " + doc.File.track[0].File_extension + "  \n";
                var FileExt = doc.File.track[0].File_extension;
                mainWindow.webContents.send('data',elements[5]);
            }
        } catch (e) {
            console.log(e);
            var FileExt = "No Data";
        }
        try {
            if (typeof doc.File.track[0].Frame_count !== undefined) {
                elements[6] = "Frame Count : " + doc.File.track[0].Frame_count + "  \n";
                var FramCnt = doc.File.track[0].Frame_count;
                mainWindow.webContents.send('data',elements[6]);
            }
        } catch (e) {
            console.log(e);
            var FramCnt = "No Data";
        }
        try {
            if (typeof doc.File.track[0].Folder_name !== undefined) {
                elements[7] = "Location : " + doc.File.track[0].Folder_name + "  \n";
                var Loc = doc.File.track[0].Folder_name;
                mainWindow.webContents.send('data',elements[7]);
            }
        } catch (e) {
            console.log(e);
            var Loc = "No Data";
        }
        try {
            if (typeof doc.File.track[0].Duration[5] !== undefined) {
                elements[8] = "Duration : " + doc.File.track[0].Duration[5] + "  \n";
                var dur = doc.File.track[0].Duration[5];
                mainWindow.webContents.send('data',elements[8]);
            }
        } catch (e) {
            console.log(e);
            var dur = "No Data";
        }
        try {
            if (typeof doc.File.track[0].Overall_bit_rate[1] !== undefined) {
                elements[9] = "Bit Rate : " + doc.File.track[0].Overall_bit_rate[1] + "  \n";
                var bitRate = doc.File.track[0].Overall_bit_rate[1];
                mainWindow.webContents.send('data',elements[9]);
            }
        } catch (e) {
            console.log(e);
            var bitRate = "No Data";
        }
        try {
            if (typeof doc.File.track[1].Codec_ID !== undefined) {
                elements[10] = "Codec ID : " + doc.File.track[1].Codec_ID + "  \n";
                codec = doc.File.track[1].Codec_ID;
                mainWindow.webContents.send('data',elements[10]);
            }
        } catch (e) {
            console.log(e);
            var codec = "No Data";
        }
        try {
            if (typeof doc.File.track[1].Color_space !== undefined) {
                elements[11] = "Color Space : " + doc.File.track[1].Color_space + "  \n";
                var clrSpc = doc.File.track[1].Color_space
                mainWindow.webContents.send('data',elements[11]);
            }
        } catch (e) {
            console.log(e);
            var clrSpc = "No Data";
        }
        try {
            if (typeof doc.File.track[1].Chroma_subsampling !== undefined) {
                elements[12] = "Chroma Subsampling : " + doc.File.track[1].Chroma_subsampling + "  \n";
                var subSample = doc.File.track[1].Chroma_subsampling;
                mainWindow.webContents.send('data',elements[12]);
            }
        } catch (e) {
            console.log(e);
            var subSample = "No Data";
        }
        try {
            if (typeof doc.File.track[1].Width !== undefined) {
                elements[13] = "Frame Size : " + doc.File.track[1].Width[0] + "x" + doc.File.track[1].Height[0] + "  \n";
                var frmSize = doc.File.track[1].Width[0] + "x" + doc.File.track[1].Height[0];
                mainWindow.webContents.send('data',elements[13]);
            }
        } catch (e) {
            console.log(e);
            var frmSize = "No Data";
        }
        try {
            if (typeof doc.File.track[1].Display_aspect_ratio[1] !== undefined) {
                elements[14] = "Aspect Ratio : " + doc.File.track[1].Display_aspect_ratio[1] + "  \n";
                var asRtio = doc.File.track[1].Display_aspect_ratio[1];
                mainWindow.webContents.send('data',elements[14]);
            }
        } catch (e) {
            console.log(e);
            var asRtio = "No Data";
        }
        try {
            if (typeof doc.File.track[1].Frame_rate !== undefined) {
                elements[15] = "Framerate : " + doc.File.track[1].Frame_rate[1] + "  \n";
                var frmRate = doc.File.track[1].Frame_rate[1];
                mainWindow.webContents.send('data',elements[15]);
            }
        } catch (e) {
            console.log(e);
            var frmRate = "No Data";
        }
        try {
            if (typeof doc.File.track[1].Bit_depth !== undefined) {
                elements[16] = "FBit Depth : " + doc.File.track[1].Bit_depth[1] + "  \n";
                var bitDpth = doc.File.track[1].Bit_depth[1];
                mainWindow.webContents.send('data',elements[16]);
            }
        } catch (e) {
            console.log(e);
            var bitDpth = "No Data";
        }
        try {
            if (typeof doc.File.track[1].Compression_mode[0] !== undefined) {
                elements[17] = "Compression Type : " + doc.File.track[1].Compression_mode[0] + "  \n";
                var cmpMode = doc.File.track[1].Compression_mode[0];
                mainWindow.webContents.send('data',elements[17]);
            }
        } catch (e) {
            console.log(e);
            var cmpMode = "No Data";
        }
        try {
            if (typeof doc.File.track[1].Color_space !== undefined) {
                elements[18] = "Color Space : " + doc.File.track[1].Color_space + "  \n";
                var clrSpc = doc.File.track[1].Color_space;
                mainWindow.webContents.send('data',elements[18]);
            }
        } catch (e) {
            console.log(e);
            var clrSpc = "No Data";
        }
        try {
            if (typeof doc.File.track[2].Channel_s_ !== undefined) {
                elements[19] = "Audio Channels : " + doc.File.track[2].Channel_s_[1] + "  \n";
                var audChnl = doc.File.track[2].Channel_s_[1];
                mainWindow.webContents.send('data',elements[19]);
            }
        } catch (e) {
            console.log(e);
            var audChnl = "No Data";
        }
        try {
            if (typeof doc.File.track[2].Codec !== undefined) {
                elements[20] = "Audio Codec : " + doc.File.track[2].Codec[1] + "  \n";
                var audCodec = doc.File.track[2].Codec[1];
                mainWindow.webContents.send('data',elements[20]);
            }
        } catch (e) {
            console.log(e);
            var audCodec = "No Data";
        }
        try {
            if (typeof doc.File.track[2].Sampling_rate[1] !== undefined) {
                elements[21] = "Audio Sample Rate : " + doc.File.track[2].Sampling_rate[1] + "  \n";
                var smplRate = doc.File.track[2].Sampling_rate[1];
                mainWindow.webContents.send('data',elements[21]);
            }
        } catch (e) {
            console.log(e);
            var smplRate = "No Data";
        }
        try {
            if (typeof doc.File.track[2].Bit_rate !== undefined) {
                elements[22] = "Audio Bit Rate : " + doc.File.track[2].Bit_rate[1] + "  \n";
                var audBitRate = doc.File.track[2].Bit_rate[1];
                mainWindow.webContents.send('data',elements[22]);
            }
        } catch (e) {
            console.log(e);
            var audBitRate = "No Data";
        }
    });

    }));
}

function createHash(file) {
sha1File(file, function (error, sum) {
  if (error) return console.log(error)
  console.log(sum) // 'c8a2e2125f94492082bc484044edb4dc837f83b' 
  mainWindow.webContents.send('data',"sha-1 checksum is: " + sum);
  mainWindow.webContents.send('data',"Inspection Complete!");
  return sum;
  
})

}

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    app.quit();
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    // if (process.platform != 'darwin') {
    //     app.quit();
    // }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        "web-preferences": {
            "web-security": false
        },
        center: true,


    });


    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/index.html');
    mainWindow.webContents.on('did-finish-load', function() {

    });

    // Open the DevTools.
    // mainWindow.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});
