# Changelog

# [2.22.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.21.1...2.22.0) (2021-10-25)


### Features

* **error:** add request id and timestamp to error output. fixes [#544](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/544) ([#545](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/545)) ([4c8b198](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/4c8b19826feb5696a4dedc1b4e4eeb34eaf4d133))

## [2.21.1](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.21.0...2.21.1) (2021-10-18)


### Bug Fixes

* **start-execution:** clarify emergency flag. fixes [#535](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/535) ([#536](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/536)) ([143ae1c](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/143ae1c848cd724c21f7c7f637f2c0183b9b254b))

# [2.21.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.20.0...2.21.0) (2021-10-14)


### Features

* **start-execution:** support for emergency mode pipeline executions. fixes [#530](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/530) ([#531](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/531)) ([d621241](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/d621241454f8161045865ec41f845f7666946e55))

# [2.20.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.19.0...2.20.0) (2021-10-12)


### Features

* **commerce:** move environmentId to be a flag to address proper defaulting. fixes [#511](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/511) ([90edcda](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/90edcdac013f0ce88ce37caacead28e748bd8100))

# [2.19.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.18.3...2.19.0) (2021-10-06)


### Features

* add support for proxies when using aio 8.2.0. fixes [#177](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/177) ([#514](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/514)) ([dd4facb](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/dd4facb15485047e6d74395f46f3b9880e15c055))

## [2.18.3](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.18.2...2.18.3) (2021-09-29)


### Bug Fixes

* ensure that -h works for all commands. fixes [#506](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/506) ([#507](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/507)) ([cf62ba7](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/cf62ba73ebeb338ef09b04e634e3b2b3a56b65f0))

## [2.18.2](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.18.1...2.18.2) (2021-09-29)


### Bug Fixes

* **deps:** update dependency @adobe/aio-lib-cloudmanager to ^1.8.1 ([#504](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/504)) ([015f8cc](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/015f8cce158dcfab244699a86322e24b32b9d594))

## [2.18.1](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.18.0...2.18.1) (2021-09-28)


### Bug Fixes

* **commerce:** Added descriptions to Commerce flags. fixes [#499](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/499) ([5312d89](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/5312d895c2ed7142ee2f44a2d5f080c34e32e737))

# [2.18.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.17.0...2.18.0) (2021-09-27)


### Features

* **commerce:** add support for additional args and flags for commerce commands. fixes [#489](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/489). fixes [#493](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/493) ([dc09c0b](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/dc09c0b78b70d58bc9d0e4378fe33053b69bcdea)), closes [#487](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/487)

# [2.17.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.16.0...2.17.0) (2021-09-23)


### Features

* **commerce-base-command:** commerce commands now auto-tail execution log. fixes [#487](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/487) ([46729ae](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/46729aef88b9d8578afe05121274f5300d6a37c1))

# [2.16.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.15.0...2.16.0) (2021-09-20)


### Features

* **commerce:** add app:config:dump command fixes [#474](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/474) ([#477](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/477)) ([61bce1f](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/61bce1fb3e8c44c3c1aa2bb3e1d9de61b706a248))

# [2.15.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.14.0...2.15.0) (2021-09-17)


### Features

* **auth:** enable dma_commerce_cloud in org:list and org:select. fixes [#481](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/481) ([#482](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/482)) ([cf0c077](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/cf0c077b0a35d7ea22928c6775a01185b24669d0))

# [2.14.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.13.0...2.14.0) (2021-09-17)


### Features

* add permissions virtual flag. fixes [#175](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/175) ([#478](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/478)) ([a150865](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/a1508656a524a0cf3965224bf1aa267fcf729694))

# [2.13.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.12.0...2.13.0) (2021-09-16)


### Features

* **app:config:import:** add app:config:import commerce command fixes [#473](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/473) ([#475](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/475)) ([5de7681](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/5de76815f6a96f363fd5ea477a704fff8be5ff54))

# [2.12.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.11.0...2.12.0) (2021-08-31)


### Features

* **commerce:** add cache:clean fixes [#460](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/460) ([#461](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/461)) ([552e11b](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/552e11bd8c0cb707c82dd161a4d6728550fb939a))
* **commerce:** add cache:flush fixes [#462](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/462) ([#463](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/463)) ([4751e68](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/4751e68811c2dceceb4930872007d25ad551181f))
* **commerce:** add maintenance:disable fixes [#466](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/466) ([#467](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/467)) ([daf0970](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/daf0970991cf5bbef8861bdcc1b5a97bed700fdb))
* **commerce:** add maintenance:enable fixes [#464](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/464) ([#465](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/465)) ([2534463](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/253446382c5dbb4586662aeba5d46e1d515f7e16))

# [2.11.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.10.1...2.11.0) (2021-08-30)


### Features

* **commerce:** add commerce:tail-command-execution-log fixes [#447](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/447) ([214f656](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/214f65646df762d8ece01d209c259f05b584d641))

## [2.10.1](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.10.0...2.10.1) (2021-08-28)


### Bug Fixes

* **environmentId:** make environmentId a common arg fixes [#457](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/457) ([#458](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/458)) ([ab85b41](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/ab85b41a902e280b701797cfe74e89466d868103))

# [2.10.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.9.0...2.10.0) (2021-08-27)


### Features

* **commerce:** add indexer:reindex fixes [#455](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/455) ([#456](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/456)) ([2bc0c21](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/2bc0c2159ece4be2da7abde0cbdaa6fe8cafd5e2))

# [2.9.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.8.2...2.9.0) (2021-08-20)


### Features

* **commerce:** list command executions fixes [#440](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/440) ([#444](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/444)) ([9f85efb](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/9f85efb5db54e7028db45ab3e53892b1855de95a))

## [2.8.2](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.8.1...2.8.2) (2021-08-19)


### Bug Fixes

* **hook:** default environment id does not work when the command has multiple args. fixes [#443](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/443) ([#445](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/445)) ([032710d](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/032710dfb225bdaa40d32761d3163245c771233b))

## [2.8.1](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.8.0...2.8.1) (2021-08-18)


### Bug Fixes

* **commerce:** fix formatTime handling for get-command-execution implementation. fixes [#441](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/441) ([#442](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/442)) ([2b11301](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/2b1130104aee57164deaeecf33607f9f4d31a878))

# [2.8.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.7.0...2.8.0) (2021-08-18)


### Features

* **commerce:** add get-command fixes [#437](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/437) ([#438](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/438)) ([8b77e11](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/8b77e11ce9277238a5750c13f62c95d3891bbab0))

# [2.7.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.6.0...2.7.0) (2021-08-12)


### Features

* **pipeline:** add support for pipeline cache invalidation. fixes [#434](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/434) ([#435](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/435)) ([b850a3f](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/b850a3f281a802a054973433babf17e5e11ac4e9))

# [2.6.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.5.0...2.6.0) (2021-08-11)


### Features

* **errors:** add specific exit code for aio-lib-ims-*. fixes [#431](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/431) ([#432](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/432)) ([06ef4c7](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/06ef4c7e7d01ad8fb9c2003e6ea715774c5d5e75))

# [2.5.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.4.3...2.5.0) (2021-08-03)


### Features

* **errors:** implement consistent error codes and exit codes. fixes [#215](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/215) ([#428](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/428)) ([e6a796c](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/e6a796ca2c43b2e88a57acbde2e06c6bbb7ac6c9))

## [2.4.3](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.4.2...2.4.3) (2021-07-28)


### Bug Fixes

* **auth:** org:list and org:select should include all AEM-entitled organizations. fixes [#423](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/423) ([#424](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/424)) ([63d924e](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/63d924e5a7419712a359783cf35b6c037d4b553c))

## [2.4.2](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.4.1...2.4.2) (2021-07-28)


### Bug Fixes

* **commerce:** update minimum version of lib. fixes [#421](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/421) ([#422](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/422)) ([b672392](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/b672392377de27fca8814ebe949208b8e811438a))

## [2.4.1](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.4.0...2.4.1) (2021-07-27)


### Bug Fixes

* **commerce:** change status to pending. fixes [#411](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/411) ([#414](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/414)) ([4babfe7](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/4babfe7336a8a68692d26a59248ee5879392c961))

# [2.4.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.3.0...2.4.0) (2021-07-26)


### Features

* **commerce:** update RUNNING status to PENDING. fixes[#409](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/409) ([#410](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/410)) ([8fb4c6e](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/8fb4c6e106b9c9348bf8f4664ec2507e0f380497))

# [2.3.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.2.2...2.3.0) (2021-07-23)


### Features

* **commerce:** update method names. fixes[#404](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/404) ([#405](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/405)) ([a999b61](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/a999b6156a35f6a31c573b065f3f0580333b299f))

## [2.2.2](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.2.1...2.2.2) (2021-07-20)


### Bug Fixes

* **commerce:** add descriptions. fixes [#396](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/396) ([#399](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/399)) ([dcfcf06](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/dcfcf0616cd58d609ae6180195243b46c7162d75))
* **help:** add proper description for ip-allowlist topic. fixes [#397](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/397) ([#398](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/398)) ([f011659](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/f0116596b14349a49d27dea3143b727280ea9552))

## [2.2.1](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.2.0...2.2.1) (2021-07-16)


### Bug Fixes

* **execution:** code quality step startedAt should only be overridden if build finished. fixes [#388](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/388) ([#389](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/389)) ([40dbade](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/40dbade348020fedfea2428baddd26b6634f0de4))

# [2.2.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.1.0...2.2.0) (2021-07-16)


### Features

* **commerce:** add initial commerce maintenance:status command. fixes [#384](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/384) ([1a5b97b](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/1a5b97b6ba12dd9116ff62b1c6a0424173d7fb04))

# [2.1.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/2.0.0...2.1.0) (2021-06-30)


### Features

* **execution:** add support for tailing step logs (limited to build). fixes [#377](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/377) ([#378](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/378)) ([fd7e49d](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/fd7e49d12a33cf0c045b3ae6cc2020445a01b6f9))

# [2.0.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.11.0...2.0.0) (2021-06-25)


### Features

* require node 12 as minimum version. fixes [#372](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/372) ([#373](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/373)) ([37336f0](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/37336f05d549865566ecc51886d978659fb90fa1))


### BREAKING CHANGES

* Installation on Node 10 will now fail

# [1.11.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.10.2...1.11.0) (2021-06-17)


### Features

* **ip-allowlist:** support binding ip allowlists to preview. fixes [#335](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/335) ([#367](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/367)) ([03010a9](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/03010a9ea7b892751bee12b7f624f0a3ffb379d7))

## [1.10.2](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.10.1...1.10.2) (2021-06-08)


### Bug Fixes

* **auth:** correct error message when access token exists but no org selected. fixes [#359](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/359) ([#360](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/360)) ([184e516](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/184e516dcc0b34fc82a953c5941266538e6639a7))

## [1.10.1](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.10.0...1.10.1) (2021-06-06)


### Bug Fixes

* **auth:** skip organization configuration check for org:select and org:list. fixes [#356](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/356) ([#357](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/357)) ([f385915](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/f385915bb689d65cf284cb29635870bb6aaad1d3))

# [1.10.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.9.0...1.10.0) (2021-06-06)


### Features

* **auth:** support selection and listing of Cloud Manager-authorized organizations. fixes [#351](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/351) ([#352](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/352)) ([cf46bee](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/cf46beed814a1cdcf87ef1c2f564b027d9973169))

# [1.9.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.8.0...1.9.0) (2021-06-05)


### Features

* **environment-variables:** add warn/error for internal variables. fixes [#285](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/285) ([#350](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/350)) ([2ee1ad2](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/2ee1ad24f689ffb9633315be23d7f6e84fd7f73a))

# [1.8.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.7.0...1.8.0) (2021-06-04)


### Features

* **auth:** enable the use of browser-based authentication. fixes [#346](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/346) ([#347](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/347)) ([e149906](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/e1499060ab0dfa6f26fe185d935fec3acbe205b3))

# [1.7.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.6.3...1.7.0) (2021-05-27)


### Features

* **variables:** support preview as an additional service. fixes [#335](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/335) ([#336](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/336)) ([7dc893e](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/7dc893ecd439594ce5e492ff6399e989c6382c18))

## [1.6.3](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.6.2...1.6.3) (2021-05-05)


### Bug Fixes

* **variables:** passing an empty variable value should throw an error. fixes [#305](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/305) ([#306](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/306)) ([91031f1](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/91031f14decd57715b8e80dc87043a965e153f53))

## [1.6.2](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.6.1...1.6.2) (2021-04-30)


### Bug Fixes

* **deps:** update aio-lib-cloudmanager for log error message fix. fixes [#300](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/300) ([#301](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/301)) ([9e47144](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/9e47144f559a03604805c4edada8176a071ba8fd))

## [1.6.1](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.6.0...1.6.1) (2021-04-29)


### Bug Fixes

* **hook:** check-ims-config is not correctly throwing errors. fixes [#295](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/295) ([#297](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/297)) ([f2a5768](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/f2a57683531d0dac1368cba038714686ff34b7de))

# [1.6.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.5.1...1.6.0) (2021-04-21)


### Features

* **variables:** show status on list variables table. fixes [#279](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/279) ([76bce13](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/76bce13f00223403bb408121e0de7a6f2e446400))

## [1.5.1](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.5.0...1.5.1) (2021-04-20)


### Bug Fixes

* **hooks:** restore behavior of default environment id. fixes [#280](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/280) ([797f0dd](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/797f0dd18110a012af91fcc2d08b16775afa25da))

# [1.5.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.4.0...1.5.0) (2021-04-13)


### Features

* **execution:** add execution status to current-execution:get. fixes [#275](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/275) ([c1cfd75](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/c1cfd75a9db67f8077a7a8bd1b43f8c1412b6184))

# [1.4.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.3.6...1.4.0) (2021-04-08)


### Features

* **variables:** support service-specific environment variables. fixes [#268](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/268) ([d0a93ac](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/d0a93ace41df356250e752155d2d2273623e0e20))

## [1.3.6](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.3.5...1.3.6) (2021-04-01)


### Bug Fixes

* **variables:** ensure that variables validation errors are output. fixes [#262](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/262) ([36a5e1f](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/36a5e1f072c2f35bca4ce821d9c2e3e4fc422378))

## [1.3.5](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.3.4...1.3.5) (2021-03-26)


### Bug Fixes

* **deps:** force the use of @adobe/aio-lib-ims-jwt higher than 2.1.1 ([de8d6f9](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/de8d6f9ee51ba188bbbf73696dd40b9b7f373a67)), closes [#256](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/256)

## [1.3.4](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.3.3...1.3.4) (2021-03-22)


### Bug Fixes

* **variables:** fix how numeric values are parsed. fixes [#253](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/253) ([5b9771f](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/5b9771f2b0eb653f5dc7877d93cff3713f8f7273))

## [1.3.3](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.3.2...1.3.3) (2021-03-09)


### Bug Fixes

* **hook:** check plugin from hookOptions in environment id hook. fixes [#242](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/242) ([6c28117](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/6c28117e269e600cec535c8e3380b06518e18826))

## [1.3.2](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.3.1...1.3.2) (2021-03-08)


### Bug Fixes

* **hook:** only check ims context on commands for this plugin ([6365e14](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/6365e146595eacbaf62e1ac0dc249fe9a3e2d328))

## [1.3.1](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.3.0...1.3.1) (2021-03-08)


### Bug Fixes

* **hook:** validate ims context configuration from flag. fixes [#237](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/237) ([9d6b1ae](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/9d6b1ae253f3eb804c1b7808cc19d37333082ff6))

# [1.3.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.2.0...1.3.0) (2021-03-05)


### Features

* **config:** add hook for validation of the IMS context configuration. fixes [#233](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/233) and [#216](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/216) ([694523d](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/694523dc0f3e8d50510f15901c13caf4930c7a89))

# [1.2.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.1.1...1.2.0) (2021-02-22)


### Bug Fixes

* **ci:** also ignoring max body length ([92430a8](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/92430a8c12e2f526c00eab4d2084cf25f496ed5f))
* **ci:** another attempt to fix commitlint ([43a1e33](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/43a1e33b5e2da7d9635d476d840f7aab60ca0f48))
* **ci:** disable footer-max-line-length commitlint rule ([ad2bfa6](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/ad2bfa69055d52a9a6ebc7d000d696a2302217fc))


### Features

* support standalone execution. fixes [#219](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/219) ([273d808](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/273d8084011adeebc8b5530f6c5098cda0f99fb7))

## [1.1.1](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.1.0...1.1.1) (2021-02-16)


### Bug Fixes

* **auth:** do not create .aio file in local directory. fixes [#212](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/212) ([ec2a9c2](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/ec2a9c22764b941a5f18005c4bdd405ddc5a1d79))

# [1.1.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/1.0.0...1.1.0) (2021-02-07)


### Features

* **pipeline:** add pipeline:list-executions. fixes [#201](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/201) ([a5968fc](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/a5968fc499d956ad55f85b9213071f1349a3926b))

# [1.0.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/0.19.0...1.0.0) (2021-02-06)


### Features

* **auth:** replace Migrate from @adobe/aio-cli-plugin-jwt-auth to @adobe/aio-lib-ims ([84abb64](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/84abb641bd3e7b3f92ece3dfb57126c29ddc1079)), closes [#129](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/129)


### BREAKING CHANGES

* **auth:** private key passphrases are no longer supported

# [0.19.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/0.18.3...0.19.0) (2021-01-13)


### Features

* **ip-allowlists:** implementation of IP Allowlist commands. relates to [#178](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/178) ([6ad76fd](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/6ad76fd8139b3d3fab4a8b6331183f6282c3cf5e))

## [0.18.3](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/0.18.2...0.18.3) (2021-01-12)


### Bug Fixes

* **deps:** update dependency @adobe/aio-lib-core-config to v2 ([f004835](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/f004835a2030d51c8c5fd49687c03b2baf314ace))

## [0.18.2](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/0.18.1...0.18.2) (2020-11-19)


### Bug Fixes

* **deps:** update dependency @oclif/plugin-help to v3 ([ed9ad22](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/ed9ad222cb28bddfdfd5a1a975209eb4eedbfedf))

## [0.18.1](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/0.18.0...0.18.1) (2020-11-18)


### Bug Fixes

* **help:** improve help output. fixes [#165](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/165) ([25ee085](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/25ee085b69dbad040d937f8f60a9c4aeedf8140f))

# [0.18.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/0.17.0...0.18.0) (2020-11-17)


### Features

* **variables:** support JSON input on stdin and files. fixes [#150](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/150) ([#153](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/153)) ([9ad5b34](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/9ad5b349969ecd7b95f7b83f7bbf573c4d89b77b))

# [0.17.0](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/0.16.3...0.17.0) (2020-11-17)


### Features

* **various:** implement loading environmentId from configuration. fixes [#149](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/149) ([#154](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/154)) ([c1b0d5e](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/c1b0d5e13f9adb9a976b3d1dad04923f205b1140))

## [0.16.3](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/0.16.2...0.16.3) (2020-11-16)


### Bug Fixes

* **build:** changelog title not respected ([16c71d4](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/16c71d4a1a30465646bba47c56cb676f3dac85e7))

## [0.16.2](https://github.com/adobe/aio-cli-plugin-cloudmanager/compare/0.16.1...0.16.2) (2020-11-16)

### Bug Fixes

* **build:** semantic-release does not update readme, changelog or package.json in git ([c893959](https://github.com/adobe/aio-cli-plugin-cloudmanager/commit/c893959acc5c3af0efd60a63fa14f6dbbd329045))

## 0.16.0 (13/11/2020)
- [**enhancement**] Restructure commands into topics [#151](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/151)

---

## 0.15.11 (12/11/2020)

- No functional changes. Purely done to change release process.

---

## 0.15.0 (12/11/2020)
- [**enhancement**] Add support for json and yaml output formats [#147](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/147)
-  Replace use of startExecution with createExecution [#145](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/145)

---

## 0.14.1 (15/10/2020)
- [**bug**] Description of tail-log and download-logs is incorrect [#142](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/142)

---

## 0.14.0 (29/09/2020)
-  Allow to use 'e'-prefixed env ids as found in cloud manager URLs [#140](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/140)
- [**enhancement**] Refactor out aio-lib-cloudmanager [#138](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/138)

---

## 0.13.0 (04/09/2020)

- [**enhancement**] Add Support for Experience Audit [#136](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/136)

## 0.12.0 (22/07/2020)
- [**enhancement**] Delete Environment [#133](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/133)

## 0.11.0 (17/07/2020)
- [**enhancement**] Support Pipeline Variables List/Set [#131](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/131)

---

## 0.10.0 (12/06/2020)
- [**enhancement**] Output error code/message when present in error response [#122](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/122)

---

## 0.9.0 (04/06/2020)
-  Support delete program through CLI [#119](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/119)

---

## 0.8.0 (27/05/2020)
-  Include validation errors in the non-debug error message [#115](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/115)
-  Remove dependency on aio-cli-plugin-runtime [#111](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/111)
-  resolve depcheck warnings [#109](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/109)

---

## 0.7.3 (27/04/2020)
-  cloudmanager:base-environment-variables-command should not be listed on readme [#101](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/101)

---

## 0.7.2 (21/04/2020)
-  Cancelling a paused deployment needs to use the advance, not cancel endpoint [#99](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/99)

---

## 0.7.1 (10/04/2020)
- [**bug**] Secret environment variables cannot be deleted [#96](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/96)

---

## 0.7.0 (26/02/2020)
- [**enhancement**] Add support for alternate files in get-execution-step-logs [#84](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/84)

---

## 0.6.2 (24/02/2020)
- [**enhancement**] DEBUG mode should output result body for errors [#80](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/80)

---

## 0.6.1 (20/02/2020)
-  when outputting variables after setting them cloudmanager:set-environment-variables doesn't output secrets properly [#78](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/78)

---

## 0.6.0 (20/02/2020)
-  Add support for listing/setting environment variables [#76](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/76)

---

## 0.5.2 (13/12/2019)
-  Switch from @adobe/aio-cna-core-config to @adobe/aio-lib-core-config wasn't done in tests [#65](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/65)

---

## 0.5.1 (12/12/2019)
-  Miscellaneous warnings when installing plugin [#61](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/61)

---

## 0.5.0 (12/12/2019)
-  Add Open Developer Console Command [#59](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/59)

---

## 0.4.0 (10/12/2019)
-  Ease setting pipeline to a tag [#57](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/57)
-  list-environments displays undefined for description [#54](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/54)

---

## 0.3.3 (11/11/2019)
-  Improve console output when no log options [#51](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/51)

---

## 0.3.2 (29/10/2019)
*No changelog for this release.*

---

## 0.3.1 (22/10/2019)
*No changelog for this release.*

---

## 0.3.0 (18/10/2019)
-  aio cloudmanager is not complete help [#44](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/44)
- [**enhancement**] add support for editing pipeline branch  [#42](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/42)
- [**enhancement**] Add support for deleting pipelines via CLI [#41](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/41)

---

## 0.2.1 (10/10/2019)
-  Require node 10 [#39](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/39)

---

## 0.2.0 (10/10/2019)
-  Add a command to get the logs for a step [#35](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/35)

---

## 0.1.6 (03/10/2019)
*No changelog for this release.*

---

## 0.1.5 (27/09/2019)
-  Should be a get execution details command [#32](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/32)

---

## 0.1.4 (13/09/2019)
-  Add support for listing environments [#30](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/30)

---

## 0.1.3 (20/08/2019)
-  Use templated execution link to get execution [#25](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/25)

---

## 0.1.2 (19/08/2019)
*No changelog for this release.*

---

## 0.1.1 (08/08/2019)
*No changelog for this release.*

---

## 0.1.0 (06/08/2019)
-  When starting an execution, the execution id should be output on the CLI [#19](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/19)

---

## 0.0.5 (23/07/2019)
- [**bug**] aio cloudmanager prints error [#16](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/16)

---

## 0.0.4 (09/07/2019)
-  Add cancel and advance commands [#7](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/7)

---

## 0.0.3 (08/07/2019)
-  plugin description is incorrect [#5](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/5)
-  add get-quality-gate-results command [#2](https://github.com/adobe/aio-cli-plugin-cloudmanager/issues/2)

---

## 0.0.2 (04/06/2019)
*No changelog for this release.*

---

## 0.0.1 (31/05/2019)
*No changelog for this release.*
