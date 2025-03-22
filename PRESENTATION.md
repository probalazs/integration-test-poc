# Testing Strategy Presentation

Duration: 60 minutes

## 1. Introduction (5 minutes)

- Brief overview of current testing challenges
- Goals of this testing strategy
- What we want to achieve

## 2. Core Concepts (10 minutes)

### Layered Architecture

- Controllers (API Layer)
- Services (Business Logic)
- DAL Services (Data Access)
- Why this separation matters

### Testing Layers

- Unit Tests (Business Logic)
- DAL Tests (Data Access)
- E2E Tests (Integration)
- Why we need all three

## 3. Database Testing Examples (10 minutes)

POC Repository:
[src/modules/product/product-dal.service.spec.ts](src/modules/product/product-dal.service.spec.ts)

Real Project Example:
[link](#)

```typescript
describe('ProductDalService', () => {
  it(
    'should return all products',
    dataSourceDecorator(async ({ datasource }) => {
      const service = new ProductDalService(datasource);
      const products = [createProduct(), createProduct()];
      await addProducts(datasource, products);

      const result = await service.findAll();

      expect(result).toEqual(products);
    }),
  );
});
```

## 4. Business Logic Testing (10 minutes)

POC Repository:
[src/modules/product/product.service.spec.ts](src/modules/product/product.service.spec.ts)

Real Project Example:
[link](#)

```typescript
describe('ProductService', () => {
  it('should calculate price with discount', () => {
    const service = new ProductService(
      createMock<ProductDalService>(),
      createMock<PriceService>(),
    );
    const product = createProductDto({
      price: 100,
      discount: 20,
    });

    const result = service.calculateFinalPrice(product);

    expect(result).toBe(80);
  });
});
```

## 5. Integration Testing (10 minutes)

POC Repository:
[src/modules/product/product.controller.spec.ts](src/modules/product/product.controller.spec.ts)

Real Project Example:
[link](#)

```typescript
describe('ProductController (E2E)', () => {
  it('should create product', async () => {
    const app = await createTestModule({
      imports: [ProductModule],
    });

    const response = await request(app.getHttpServer())
      .post('/products')
      .send(createCreateProductDto());

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
    });
  });
});
```

## 6. Expected Outcomes (5 minutes)

1. **Quality Improvements**

   - Reduced production bugs
   - Faster bug detection
   - More reliable releases
   - Better code maintainability

2. **Development Efficiency**

   - Faster development cycles
   - Clear testing patterns
   - Reduced manual testing
   - Better developer experience

3. **QA Efficiency**
   - Focus on complex scenarios
   - Reduced repetitive testing
   - Better use of QA expertise
   - More time for exploratory testing

## 7. Q&A (10 minutes)

- Open discussion
- Address concerns
- Gather feedback

## Key Takeaways

1. Clear testing strategy
2. Defined responsibilities
3. Expected outcomes
4. Next steps?
