# Changelog

## [1.0.1](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/compare/v1.0.0...v1.0.1) (2025-10-27)


### Bug Fixes

* enhance displayName logic in DynamicZoneSection to ensure valid string values ([6f25acb](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/6f25acb400a260e519a7c0f3fe7552697c764e3b))
* icon mappings for Picture and Apps in DynamicZoneSection ([63e5803](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/63e5803849ed4eca5c65d0ff0fa7a890c7310adf))
* update dependency in TableOfContentPanel to include props.model in effect dependencies ([9767643](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/9767643c360fccceb1c947b69ab8634bac558627))

## 1.0.0 (2025-10-27)


### Features

* add displayIcon option to config schema and implement icon rendering in PrimitiveSection component ([7aa180d](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/7aa180d96d01a0b2a8698f37a73613a66fa300e2))
* add displayIcon support to DynamicZones' components ([d946731](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/d946731c7577965e452ccddf307fd0a5b1dcbe68))
* add support for 'primitive' type ([7285d51](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/7285d51e62df3b89d1892c9d1ef99a8cf3ba3905))
* add support for 'separator' type in config schema and update TableOfContentPanel to render separators ([a708493](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/a708493d39e7c7dc0e479ac24fb8bb8ddde13384))
* config ([c6025f2](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/c6025f211e32ef3b1c57f96e91b24b41a9d88e8f))
* Display developer's selected targetDynamicZoneFieldName ([3450c78](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/3450c78ececd69b4155841895a54b23bfbab7198))
* display stringified values ([ec3db89](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/ec3db89ac06896266a9a1706c751ee584c625820))
* do not display toc if dynamic zone is not present or empty ([93b32d8](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/93b32d84ee85c86c3b9c12c43c3dce507799da16))
* Dynamic Zone component level with null value is ignored in ToC render ([08fdea8](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/08fdea8c490770636fcc0b042a5b73f4217c0a4e))
* enhance DynamicZoneSection to manage component levels ([7e1f664](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/7e1f664ec501440d9bd79984e8d1c4ce7f32cb14))
* enhance DynamicZoneSection to support component levels with field references ([c529085](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/c5290858bafeccc336e20600b91534a874e62329))
* Enhance Table of Content Panel with error handling and retry functionality ([b9b37da](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/b9b37da217ac0f78d14eff05f5990371d9c3d716))
* implement dynamic zone component click handling and scrolling in DynamicZoneSection ([857efa1](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/857efa1c7c26386383d62cb77be4ba27731d42d0))
* refactor DynamicZoneSection to use a helper function for field labels ([4aac301](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/4aac3014a4d6d9c0d8fc4f245c017b9e6289c48e))
* server route to retrieve config for uid ([096b5d4](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/096b5d4443ec6cd94d198c3fe6292a9d5bf7cb3d))
* split Table of Content Panel in Sections ([3b816a2](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/3b816a22438a42aa5877a16dc9d662b6d2428e36))
* Table of Content POC ([60079f4](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/60079f4add04222f8975df6a63ea50ec7ece4114))
* ToC ([be62323](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/be62323fcb431a9c11f10fae71a0f749b24cceaf))
* ToC basic indent ([1820284](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/182028488d2f941b1e668fa430c92f85bbec2293))
* ToC basic indent ([57fa4fc](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/57fa4fcfae4762ff184cd4a85a0c9ba6af8fffe9))
* ToC display ([0cdbce8](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/0cdbce878d67bd296c6332d2c255d99ceef2f74c))
* update DynamicZoneSection and PrimitiveSection to utilize display labels and improve layout handling ([10eb2ad](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/10eb2addafae679edf55c1b242dba9cf35692c24))
* update README ([40da2bc](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/40da2bc2636ee0f9156342569a53181a02cdf5a6))
* update Table of Content Panel to use fields ([b710208](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/b710208ccd404519edf742f548aae2bdd56931d3))
* update Table of Content Panel to use fields ([e11658b](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/e11658b970db74f5e03ae598d724005cb5c17619))


### Bug Fixes

* Change DZComponent id type from string to number and update form value references in Table of Content Panel ([391b3d3](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/391b3d3aad1550fe066501495f531ac5c69f2504))
* **deps:** update ([5c135ff](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/5c135ff517621a38178aad4984e847aa128afec4))
* **deps:** update dependency react-intl to ^7.1.12 ([b46e1e7](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/b46e1e79d9449bccf75a1da844c6c46e2b6c3288))
* **deps:** update dependency react-intl to ^7.1.12 ([bbe60f1](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/bbe60f100919365926700fc9ead44e571c6b73b0))
* Dynamic Zone component level with null value is ignored in ToC render ([96e3e28](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/96e3e2895babc3199d972820e5c3e76d78016b9a))
* enhance handlePrimitiveClick function to support various input types and improve scrolling behavior ([1177f36](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/1177f3604a7a887c53fcc09eac9e62ecbee606dc))
* handle specific icon cases in DynamicZoneSection component ([53a5969](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/53a59695fccbf793bc9270f89de49c774534bce0))
* update displayIcon fallback logic in DynamicZoneSection and adjust gap in TableOfContentPanel ([5ef8e37](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/5ef8e37c73b63fbc2966b43a28718c9ed68eaeff))
* use strapi types ([55c9ebf](https://github.com/ChristopheCVB/strapi-plugin-table-of-content/commit/55c9ebfc04347e76fb7798482f29bc60090c59ed))
