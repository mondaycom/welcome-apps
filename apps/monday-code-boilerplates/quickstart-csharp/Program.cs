using System;
using System.Collections;

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
var url = $"http://0.0.0.0:{port}";
var name = Environment.GetEnvironmentVariable("NAME") ?? "World";

var app = builder.Build();

app.MapGet("/", () => {
    Console.WriteLine();
    Console.WriteLine("Get Environment Variables: ");
    foreach (DictionaryEntry de in Environment.GetEnvironmentVariables())
        Console.WriteLine("  {0} = {1}", de.Key, de.Value);

    return "Hello from dotnet " + name;
});

app.Run(url);