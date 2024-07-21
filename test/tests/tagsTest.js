"use strict";

describe("Zotero.Tags", function () {
	describe("#getID()", function () {
		it("should return tag id", function* () {
			var tagName = Zotero.Utilities.randomString();
			var item = createUnsavedDataObject('item');
			item.addTag(tagName);
			yield item.saveTx();
			
			assert.typeOf(Zotero.Tags.getID(tagName), "number");
		})
	})
	
	describe("#getName()", function () {
		it("should return tag id", function* () {
			var tagName = Zotero.Utilities.randomString();
			var item = createUnsavedDataObject('item');
			item.addTag(tagName);
			yield item.saveTx();
			
			var libraryID = Zotero.Libraries.userLibraryID;
			var tagID = Zotero.Tags.getID(tagName);
			assert.equal(Zotero.Tags.getName(tagID), tagName);
		})
	})
	
	describe("#rename()", function () {
		it("should mark items as changed", function* () {
			var item1 = yield createDataObject('item', { tags: [{ tag: "A" }], synced: true });
			var item2 = yield createDataObject('item', { tags: [{ tag: "A" }, { tag: "B" }], synced: true });
			var item3 = yield createDataObject('item', { tags: [{ tag: "B" }, { tag: "C" }], synced: true });
			
			yield Zotero.Tags.rename(item1.libraryID, "A", "D");
			assert.isFalse(item1.synced);
			assert.isFalse(item2.synced);
			assert.isTrue(item3.synced);
		});
	});
	
	describe("#removeFromLibrary()", function () {
		it("should delete tags in given library", async function () {
			var libraryID = Zotero.Libraries.userLibraryID;
			var groupLibraryID = (await getGroup()).libraryID;
			
			var item1 = await createDataObject('item', { tags: [{ tag: 'a' }, { tag: 'b', type: 1 }] });
			var item2 = await createDataObject('item', { tags: [{ tag: 'b' }, { tag: 'c', type: 1 }] });
			var item3 = await createDataObject('item', { tags: [{ tag: 'd', type: 1 }] });
			var item4 = await createDataObject('item', { libraryID: groupLibraryID, tags: [{ tag: 'a' }, { tag: 'b', type: 1 }] });
			
			var tagIDs = ['a', 'd'].map(x => Zotero.Tags.getID(x));
			await Zotero.Tags.removeFromLibrary(libraryID, tagIDs);
			
			assert.sameDeepMembers(item1.getTags(), [{ tag: 'b', type: 1 }]);
			assert.sameDeepMembers(item2.getTags(), [{ tag: 'b' }, { tag: 'c', type: 1 }]);
			assert.lengthOf(item3.getTags(), 0);
			assert.equal(Zotero.Tags.getID('a'), tagIDs[0]);
			assert.isFalse(Zotero.Tags.getID('d'));
			
			// Group item should still have all tags
			assert.sameDeepMembers(item4.getTags(), [{ tag: 'a' }, { tag: 'b', type: 1 }]);
			assert.equal(
				await Zotero.DB.valueQueryAsync(
					"SELECT COUNT(*) FROM itemTags WHERE itemID=?",
					item4.id
				),
				2
			);
		});
		
		
		it("should remove tags of a given type", async function () {
			var libraryID = Zotero.Libraries.userLibraryID;
			var groupLibraryID = (await getGroup()).libraryID;
			
			var item1 = await createDataObject('item', { tags: [{ tag: 'a' }, { tag: 'b', type: 1 }] });
			var item2 = await createDataObject('item', { tags: [{ tag: 'b' }, { tag: 'c', type: 1 }] });
			var item3 = await createDataObject('item', { tags: [{ tag: 'd', type: 1 }] });
			var item4 = await createDataObject('item', { libraryID: groupLibraryID, tags: [{ tag: 'a' }, { tag: 'b', type: 1 }] });
			
			var tagIDs = ['a', 'b', 'c', 'd'].map(x => Zotero.Tags.getID(x));
			var tagType = 1;
			await Zotero.Tags.removeFromLibrary(libraryID, tagIDs, null, tagType);
			
			assert.sameDeepMembers(item1.getTags(), [{ tag: 'a' }]);
			assert.sameDeepMembers(item2.getTags(), [{ tag: 'b' }]);
			assert.lengthOf(item3.getTags(), 0);
			assert.isFalse(Zotero.Tags.getID('d'));
			
			// Group item should still have all tags
			assert.sameDeepMembers(item4.getTags(), [{ tag: 'a' }, { tag: 'b', type: 1 }]);
			assert.equal(
				await Zotero.DB.valueQueryAsync(
					"SELECT COUNT(*) FROM itemTags WHERE itemID=?",
					item4.id
				),
				2
			);
		});
		
		
		it("should delete colored tag when removing tag", async function () {
			var libraryID = Zotero.Libraries.userLibraryID;
			
			var tag = Zotero.Utilities.randomString();
			var item = await createDataObject('item', { tags: [{ tag: tag, type: 1 }] });
			await Zotero.Tags.setColor(libraryID, tag, '#ABCDEF', 0);
			
			await Zotero.Tags.removeFromLibrary(libraryID, [Zotero.Tags.getID(tag)]);
			
			assert.lengthOf(item.getTags(), 0);
			assert.isFalse(Zotero.Tags.getColor(libraryID, tag));
		});
		
		it("shouldn't delete colored tag when removing tag of a given type", async function () {
			var libraryID = Zotero.Libraries.userLibraryID;
			
			var tag = Zotero.Utilities.randomString();
			var item = await createDataObject('item', { tags: [{ tag: tag, type: 1 }] });
			await Zotero.Tags.setColor(libraryID, tag, '#ABCDEF', 0);
			
			await Zotero.Tags.removeFromLibrary(libraryID, [Zotero.Tags.getID(tag)], null, 1);
			
			assert.lengthOf(item.getTags(), 0);
			assert.ok(Zotero.Tags.getColor(libraryID, tag));
		});
	})
	
	describe("#purge()", function () {
		it("should remove orphaned tags", function* () {
			var libraryID = Zotero.Libraries.userLibraryID;
			
			var tagName = Zotero.Utilities.randomString();
			var item = createUnsavedDataObject('item');
			item.addTag(tagName);
			yield item.saveTx();
			
			var tagID = Zotero.Tags.getID(tagName);
			assert.typeOf(tagID, "number");
			
			yield item.eraseTx();
			
			assert.equal(Zotero.Tags.getName(tagID), tagName);
			
			yield Zotero.DB.executeTransaction(async function () {
				await Zotero.Tags.purge();
			});
			
			assert.isFalse(Zotero.Tags.getName(tagID));
		})
	})
	
	
	describe("#setColor()", function () {
		var libraryID;
		
		beforeEach(function* () {
			libraryID = Zotero.Libraries.userLibraryID;
			
			// Clear library tag colors
			var colors = Zotero.Tags.getColors(libraryID);
			for (let color of colors.keys()) {
				yield Zotero.Tags.setColor(libraryID, color);
			}
		});
		
		it("should set color for a tag", function* () {
			var aColor = '#ABCDEF';
			var bColor = '#BCDEF0';
			yield Zotero.Tags.setColor(libraryID, "A", aColor);
			yield Zotero.Tags.setColor(libraryID, "B", bColor);
			
			var o = Zotero.Tags.getColor(libraryID, "A")
			assert.equal(o.color, aColor);
			assert.equal(o.position, 0);
			var o = Zotero.Tags.getColor(libraryID, "B")
			assert.equal(o.color, bColor);
			assert.equal(o.position, 1);
			
			var o = Zotero.SyncedSettings.get(libraryID, 'tagColors');
			assert.isArray(o);
			assert.lengthOf(o, 2);
			assert.sameMembers(o.map(c => c.color), [aColor, bColor]);
		});
		
		it("should clear color for a tag", function* () {
			var aColor = '#ABCDEF';
			yield Zotero.Tags.setColor(libraryID, "A", aColor);
			var o = Zotero.Tags.getColor(libraryID, "A")
			assert.equal(o.color, aColor);
			assert.equal(o.position, 0);
			
			yield Zotero.Tags.setColor(libraryID, "A", false);
			assert.equal(Zotero.Tags.getColors(libraryID).size, 0);
			assert.isFalse(Zotero.Tags.getColor(libraryID, "A"));
			
			var o = Zotero.SyncedSettings.get(libraryID, 'tagColors');
			assert.isNull(o);
		});
	});
	
	
	describe("#removeColoredTagsFromItems()", function () {
		it("shouldn't remove regular tags", async function () {
			var libraryID = Zotero.Libraries.userLibraryID;
			var item = await createDataObject('item', {
				tags: [
					{ tag: 'A' },
					{ tag: 'B', type: 1 },
					{ tag: 'C' },
					{ tag: 'D', type: 1 }
				]
			});
			await Zotero.Tags.setColor(libraryID, 'C', '#111111', 0);
			await Zotero.Tags.setColor(libraryID, 'D', '#222222', 1);
			
			await Zotero.Tags.removeColoredTagsFromItems([item]);
			
			assert.sameDeepMembers(item.getTags(), [
				{ tag: 'A' },
				{ tag: 'B', type: 1 }
			]);
		});
	});

	describe("#extractEmojiForItemsList()", function () {
		it("should return first emoji span", function () {
			assert.equal(Zotero.Tags.extractEmojiForItemsList("🐩🐩🐩  🐩🐩🐩🐩"), "🐩🐩🐩");
		});
		it("should return first emoji span when string doesn't start with emoji", function () {
			assert.equal(Zotero.Tags.extractEmojiForItemsList("./'!@#$ 🐩🐩🐩  🐩🐩🐩🐩"), "🐩🐩🐩");
		});
		
		it("should return first emoji span for text with an emoji with Variation Selector-16", function () {
			assert.equal(Zotero.Tags.extractEmojiForItemsList("Here are ⭐️⭐️⭐️⭐️⭐️"), "⭐️⭐️⭐️⭐️⭐️");
		});
		
		it("should return first emoji span for text with an emoji made up of multiple characters with ZWJ", function () {
			assert.equal(Zotero.Tags.extractEmojiForItemsList("We are 👨‍🌾👨‍🌾. And I am a 👨‍🏫."), "👨‍🌾👨‍🌾");
		});
	});

	describe("#compareTagsOrder()", function () {
		it('should order colored tags by position and other tags - alphabetically', async function () {
			var libraryID = Zotero.Libraries.userLibraryID;
			await createDataObject('item', {
				tags: [
					{ tag: 'one' },
					{ tag: 'two', type: 1 },
					{ tag: 'three' },
					{ tag: 'four', type: 1 },
					{ tag: 'five' },
					{ tag: 'six😀' },
					{ tag: 'seven😀' }
				]
			});
			await Zotero.Tags.setColor(libraryID, 'three', '#111111', 0);
			await Zotero.Tags.setColor(libraryID, 'four', '#222222', 1);
			await Zotero.Tags.setColor(libraryID, 'two', '#222222', 2);
 
			assert.equal(Zotero.Tags.compareTagsOrder(libraryID, 'three', 'one'), -1, "colored vs ordinary tag -> -1");
			assert.equal(Zotero.Tags.compareTagsOrder(libraryID, 'one', 'three'), 1, "ordinary vs colored -> 1");

			assert.equal(Zotero.Tags.compareTagsOrder(libraryID, 'three', 'six😀'), -1, "colored vs emoji tag -> -1");
			assert.equal(Zotero.Tags.compareTagsOrder(libraryID, 'six😀', 'three'), 1, "emoji vs colored tag -> 1");

			assert.equal(Zotero.Tags.compareTagsOrder(libraryID, 'two', 'three'), 2, "colored vs colored => compare their positions");
			

			assert.equal(Zotero.Tags.compareTagsOrder(libraryID, 'one', 'six😀'), 1, "ordinary tag vs tag with emoji -> 1");
			assert.equal(Zotero.Tags.compareTagsOrder(libraryID, 'six😀', 'one'), -1, "tag with emoji vs ordinary tag -> -1");

			assert.equal(Zotero.Tags.compareTagsOrder(libraryID, 'six😀', 'seven😀'), 1, "both emoji tags -> alphabetical");
			assert.isAbove(Zotero.Tags.compareTagsOrder(libraryID, 'one', 'five'), 0, "ordinary tag vs ordinary tag -> alphabetical");
		});
	});
});
