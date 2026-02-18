import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Item from '@/models/Item';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

// GET all items (with optional search)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim();

    let filter = {};
    if (search) {
      const regex = { $regex: search, $options: 'i' };
      filter = {
        $or: [
          { name: regex },
          { description: regex },
          { category: regex },
        ],
      };
    }

    const items = await Item.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Get items error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

// CREATE new item (admin only)
export const POST = withAuth(
  async (req: AuthenticatedRequest) => {
    try {
      await dbConnect();

      const { name, description, category, quantity, price } = await req.json();

      if (!name || !description || !category || quantity === undefined || price === undefined) {
        return NextResponse.json(
          { error: 'All fields are required' },
          { status: 400 }
        );
      }

      const item = await Item.create({
        name,
        description,
        category,
        quantity,
        price,
        createdBy: req.user!.userId,
      });

      return NextResponse.json({
        message: 'Item created successfully',
        item,
      }, { status: 201 });
    } catch (error) {
      console.error('Create item error:', error);
      return NextResponse.json(
        { error: 'Failed to create item' },
        { status: 500 }
      );
    }
  },
  { requireAdmin: true }
);

// UPDATE item (admin only)
export const PUT = withAuth(
  async (req: AuthenticatedRequest) => {
    try {
      await dbConnect();

      const { id, name, description, category, quantity, price } = await req.json();

      if (!id) {
        return NextResponse.json(
          { error: 'Item ID is required' },
          { status: 400 }
        );
      }

      const item = await Item.findByIdAndUpdate(
        id,
        { name, description, category, quantity, price },
        { new: true, runValidators: true }
      );

      if (!item) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: 'Item updated successfully',
        item,
      });
    } catch (error) {
      console.error('Update item error:', error);
      return NextResponse.json(
        { error: 'Failed to update item' },
        { status: 500 }
      );
    }
  },
  { requireAdmin: true }
);

// DELETE item (admin only)
export const DELETE = withAuth(
  async (req: AuthenticatedRequest) => {
    try {
      await dbConnect();

      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if (!id) {
        return NextResponse.json(
          { error: 'Item ID is required' },
          { status: 400 }
        );
      }

      const item = await Item.findByIdAndDelete(id);

      if (!item) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: 'Item deleted successfully',
      });
    } catch (error) {
      console.error('Delete item error:', error);
      return NextResponse.json(
        { error: 'Failed to delete item' },
        { status: 500 }
      );
    }
  },
  { requireAdmin: true }
);
