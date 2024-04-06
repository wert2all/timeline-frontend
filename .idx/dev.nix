{pkgs}: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs_20
    pkgs.yarn
  ];
  idx.extensions = [
    "angular.ng-template"
    "angular.ng-template"
    "esbenp.prettier-vscode"
    "cyrilletuzi.angular-schematics"
    "graphql.vscode-graphql"
    "bradlc.vscode-tailwindcss"
  ];
  idx.previews = {
    previews = [
      {
        command = [
          "yarn"
          "run"
          "start"
          "--"
          "--port"
          "$PORT"
          "--host"
          "0.0.0.0"
          "--disable-host-check"
        ];
        manager = "web";
        id = "web";
      }
    ];
  };
}