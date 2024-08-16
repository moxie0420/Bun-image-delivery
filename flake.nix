{
  inputs = {
    nixpkgs.url = "github:cachix/devenv-nixpkgs/rolling";
    systems.url = "github:nix-systems/default";
    devenv.url = "github:cachix/devenv";
    devenv.inputs.nixpkgs.follows = "nixpkgs";
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs = {
    self,
    nixpkgs,
    devenv,
    systems,
    ...
  } @ inputs: let
    forEachSystem = nixpkgs.lib.genAttrs (import systems);
  in {
    packages = forEachSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
      node-modules = pkgs.mkYarnPackage {
        name = "node-modules";
        src = ./.;
      };
      bid = pkgs.stdenv.mkDerivation {
        name = "bid";
        src = ./.;
        buildInputs = [pkgs.bun node-modules];
        buildPhase = ''
          ln -s ${node-modules}/libexec/bun-image-delivery/node_modules node_modules
          ${pkgs.bun}/bin/bun compile
        '';
        installPhase = ''
          mkdir $out
          mv dist/bid $out
        '';
      };
    in {
      devenv-up = self.devShells.${system}.default.config.procfileScript;
      dependencies = node-modules;
      default = bid;
    });

    devShells =
      forEachSystem
      (system: let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        default = devenv.lib.mkShell {
          inherit inputs pkgs;
          modules = [
            {
              # https://devenv.sh/reference/options/
              packages = with pkgs; [prettier];

              languages.javascript = {
                enable = true;
                bun = {
                  enable = true;
                  install.enable = false;
                };
              };

              scripts = {
                setup.exec = "bun install";
                dev.exec = "setup; bun --watch run src/index.ts";
                build.exec = "bun build ./src/index.ts --outdir ./out --target bun";
                compile.exec = "bun build ./src/index.ts --compile --outfile ./out/image-server";
                clean.exec = "rm -rf ./out";
              };
            }
          ];
        };
      });
  };
}
