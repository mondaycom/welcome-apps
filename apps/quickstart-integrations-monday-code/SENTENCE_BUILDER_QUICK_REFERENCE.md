# Sentence Builder Integration - Quick Reference

## ✅ Checklist for Developer Center Setup

### 1. Multi-Region Setup
- [ ] Enable multi-region support in General tab
- [ ] Connect to monday code for US region
- [ ] Connect to monday code for EU region
- [ ] Connect to monday code for AU region

### 2. Create Integration Feature
- [ ] Go to Features → Create feature → Integration
- [ ] Name: "Sentence Builder"
- [ ] Add Action block: "Build Sentence"
- [ ] Configure input fields (see below)

### 3. Configure Action Block Input Fields
Required fields:
- [ ] `boardId` (Board field, required)
- [ ] `itemId` (Item field, required)
- [ ] `targetColumnId` (Column field, required)

Optional fields:
- [ ] `sourceColumnIds` (Column field, multiple, optional)
- [ ] `separator` (Text field, optional, default: " ")
- [ ] `template` (Text field, optional)
- [ ] `staticTextParts` (Text field, multiple, optional)

### 4. Set Action Endpoint
- [ ] Endpoint URL: `/monday/execute_sentence_builder`
- [ ] Method: `POST`

### 5. Configure Secrets
- [ ] Add `MONDAY_SIGNING_SECRET` secret
- [ ] Set value for **US** region
- [ ] Set value for **EU** region
- [ ] Set value for **AU** region

### 6. Deploy to All Regions
```bash
# Get your APP_VERSION_ID from Developer Center
mapps code:push -i <APP_VERSION_ID> -z us
mapps code:push -i <APP_VERSION_ID> -z eu
mapps code:push -i <APP_VERSION_ID> -z au
```

### 7. Test & Promote
- [ ] Test integration in each region
- [ ] Verify all secrets are configured
- [ ] Promote version to live

## 📋 Endpoint Details

**Endpoint:** `POST /monday/execute_sentence_builder`

**Authentication:** Required (uses `authorizeRequest` middleware)

**Request Example:**
```json
{
  "payload": {
    "inputFields": {
      "boardId": "1234567890",
      "itemId": "1234567891",
      "sourceColumnIds": ["text1", "text2"],
      "targetColumnId": "result",
      "separator": " - ",
      "staticTextParts": ["Hello", "World"]
    }
  }
}
```

**Response Example:**
```json
{
  "itemId": "1234567891",
  "targetColumnId": "result",
  "builtSentence": "Hello - World - Column1 - Column2",
  "partsUsed": 4
}
```

## 🔧 How It Works

1. **Collects text from:**
   - Source columns (if provided)
   - Static text parts (if provided)

2. **Builds sentence using:**
   - **Simple mode:** Joins parts with separator
   - **Template mode:** Uses template with `{part1}`, `{part2}`, etc.

3. **Updates target column** with the built sentence

## 🌍 Multi-Region Notes

- Requests are automatically routed to the correct regional deployment
- Each region requires its own secrets configuration
- Must deploy to all three regions (US, EU, AU) for global availability
- Once promoted to live, multi-region cannot be disabled

## 📚 Documentation

- Full setup guide: `SENTENCE_BUILDER_SETUP.md`
- monday.com Apps Docs: https://developer.monday.com/apps/docs
- Custom Actions: https://developer.monday.com/apps/docs/custom-actions
- Multi-Region: https://developer.monday.com/apps/docs/multi-region-feature

