Feature("MyTest");

Scenario("find the service title", I => {
  I.amOnPage("http://localhost:3000");
  I.see("어떻게 풀 것인가");
});

Scenario("find print button", I => {
  I.amOnPage("http://localhost:3000");
  I.see("Print");
});
