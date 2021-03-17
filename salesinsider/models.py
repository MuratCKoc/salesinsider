def create_classes(db):
    class Groceries(db.Model):
        __tablename__ = 'groceries'

        Member_number = db.Column(db.Integer, primary_key=True)
        Date = db.Column(db.Date)
        itemDescription = db.Column(db.String())

        def __repr__(self):
            return '<Grocery id %r>' % (self.name)
    return Groceries