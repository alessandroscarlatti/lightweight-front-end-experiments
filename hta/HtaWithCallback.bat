<!-- :: Batch section
@echo off
setlocal

echo Select an option:
for /F "delims=" %%a in ('mshta.exe "%~F0"') do set "HTAreply=%%a"
echo End of HTA window, reply: "%HTAreply%"
goto :EOF
-->

<!DOCTYPE html>
<html lang="en">

<head>
	<meta http-equiv="x-ua-compatible" content="ie=11">
	<hta:application icon="#">
		<title>Bootstrap Example</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css">

		<script type="text/javascript">
			function doSomething() {
				console.log("hey!");
			}

			function runHelloWorldVisible() {
				var shell = new ActiveXObject("WScript.Shell");
				var path = '"C:/Users/pc/Desktop/FindAndReplaceFromCommandLine/hta/helloWorld.bat"';
				var result = shell.run(path, 1, true);
				console.log(result);
			}

			function runHelloWorldInvisible() {
				var shell = new ActiveXObject("WScript.Shell");
				var path = '"C:/Users/pc/Desktop/FindAndReplaceFromCommandLine/hta/helloWorld.bat"';
				var result = shell.run(path, 0, true);
				console.log(result);
			}

			function execHelloWorld() {
				var shell = new ActiveXObject("WScript.Shell");
				var path = '"C:/Users/pc/Desktop/FindAndReplaceFromCommandLine/hta/helloWorld.bat"';
				var exec = shell.exec(path);

				performIfDone(exec, function () {
					console.log("status: " + exec.status + " exitCode: " + exec.exitCode + " stdOut: " + exec.StdOut.ReadAll());
				})
			}

			function executeShellHelloWorld() {
				var objShell = new ActiveXObject("Shell.Application");
				var bat = "C:/Users/pc/Desktop/FindAndReplaceFromCommandLine/hta/helloWorld.bat";
				var exec = objShell.ShellExecute(bat, "", "", "open", 1);
			}

			function performIfDone(exec, onDone) {
				if (exec.Status == 0) {
					setTimeout(performIfDone.bind(this, exec, onDone), 100);
				}
				else {
					onDone();
				}
			}

			var exec;

			function execInteractiveWithConsoleEmulator() {
				var shell = new ActiveXObject("WScript.Shell");
				var path = '"C:/Users/pc/Desktop/FindAndReplaceFromCommandLine/hta/quickblock.bat"';
				exec = shell.exec(path);
				
				readStdOut(exec.StdOut, function(output) {
					document.getElementById("consoleOutput").value += output;
				});
			}

			var column = -1;
			var line = -1;

			function readStdOut(stdOut, consumer) {
				console.log("line:" + stdOut.Line + " column: " + stdOut.Column + " eof? " + stdOut.AtEndOfStream);
				if (stdOut.Column != column || stdOut.Line > line) {
					column = stdOut.Column;
					line = stdOut.Line;
					var output = stdOut.Read(0);  // this is a blocking call!!!
					consumer(output);

					if (output.indexOf("done") !== -1) {
						console.log("done");
						return;
					}
				}

				setTimeout(readStdOut.bind(this, stdOut, consumer), 50);
			}

			function acceptInput(e) {
				console.log(e.target.value)
				console.log("key: " + e.key)
				console.log("code: " + e.code)
				// exec.StdIn.Write(e.key);
			}

			function sendY() {
				exec.StdIn.Write("y\n");
			}

			function sendN() {
				exec.StdIn.Write("n\n");
			}

			function appendOutput(output) {
				document.getElementById("consoleOutput").value += output;
			}



		</script>
		<script src="console.js"></script>
</head>

<body>
	<div class="jumbotron text-center">
		<h1>My First Bootstrap Page</h1>
		<p>Resize this responsive page to see the effect!</p>
	</div>
	<div class="container">
		<div class="row">
			<div class="col-sm-6">
				<input class="form-control" id="consoleInput" type="text" />
			</div>
			<div class="col-sm-6">
				<textarea class="form-control" rows="20" id="consoleOutput" style="resize: vertical;"></textarea>
			</div>
		</div>

		<div class="row">
				<div class="btn btn-warning" onclick="execInteractiveWithConsoleEmulator()">
					Run Interactive!
				</div>
			</div>

		<div class="row">
			<div class="btn btn-primary" onclick="runHelloWorldVisible()">
				Run Hello World Visible!
			</div>
		</div>
		<div class="row">
			<div class="btn btn-primary" onclick="runHelloWorldInvisible()">
				Run Hello World Invisible!
			</div>
		</div>
		<div class="row">
			<div class="btn btn-primary" onclick="execHelloWorld()">
				Exec Hello World!
			</div>
		</div>
		<div class="row">
			<div class="btn btn-primary" onclick="executeShellHelloWorld()">
				ShellExecute Hello World!
			</div>
		</div>
		<div class="row">
			<div class="col-sm-4">
				<h3>Column 1</h3>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
				<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...</p>
			</div>
			<div class="col-sm-4">
				<h3>Column 2</h3>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
				<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...</p>
			</div>
			<div class="col-sm-4">
				<h3>Column 3</h3>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
				<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...</p>
			</div>

		</div>


	</div>

	<script>
		(function() {
			document.getElementById("consoleInput").onkeyup = acceptInput;
		})();
	</script>
</body>

</html>