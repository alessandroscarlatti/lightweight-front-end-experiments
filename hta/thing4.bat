<!-- :: Batch section
@echo off
setlocal

echo *****************************
echo ** Cool Utility            **
echo *****************************
echo.
echo *******
echo ** Running...
echo **
echo.

for /F "delims=" %%a in ('mshta.exe "%~F0"') do set "HTAreply=%%a"

echo *******
echo ** Exiting with code "%HTAreply%"
echo **
echo.
goto :EOF
-->

<!DOCTYPE html>
<html lang="en">

<head>
	<title>HTA Application</title>
	<meta http-equiv="x-ua-compatible" content="ie=9">
	<!-- <hta:application icon="http://stackoverflow.com/favicon.ico"> -->
	<hta:application icon="magnify.exe">
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
	<link rel="favicon" href="http://stackoverflow.com/favicon.ico">
	<script type="text/javascript">
		function doSomething() {
			alert("hey!");
		}
	</script>
</head>

<body>
	<div class="jumbotron text-center">
		<h1>My First Bootstrap Page</h1>
		<p>Resize this responsive page to see the effect!</p>
	</div>

	<div class="container">
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
		<div class="row">
			<div class="alert alert-primary" role="alert">
				A simple primary alert--check it out!
			</div>
		</div>
		<div class="row">
			<div class="btn btn-primary" onclick="doSomething()">
				Do Something
			</div>
		</div>

	</div>

</body>

</html>