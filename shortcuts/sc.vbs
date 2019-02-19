Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = "C:\users\pc\Desktop\FindAndReplaceFromCommandLine\shortcuts\shortcut.lnk"
Set oLink = oWS.CreateShortcut(sLinkFile)
    oLink.TargetPath = "%windir%\explorer.exe"
    oLink.Arguments = "depth1\test.bat"
 '  oLink.Description = "MyProgram"   
 '  oLink.HotKey = "ALT+CTRL+F"
    oLink.IconLocation = "C:\Users\pc\IdeaProjects\launch4j-gradle-plugin\build\avatar\icon.ico, 0"
    oLink.WindowStyle = "1"   
 '  oLink.WorkingDirectory = "C:\Program Files\MyApp"
oLink.Save